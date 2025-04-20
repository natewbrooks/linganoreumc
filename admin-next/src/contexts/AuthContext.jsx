'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [sessionExpired, setSessionExpired] = useState(false);
	const [wasAuthenticatedOnce, setWasAuthenticatedOnce] = useState(false);

	const router = useRouter();

	const checkAuth = async () => {
		try {
			// Using axios consistently with withCredentials: true
			const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/auth/login`, {
				withCredentials: true,
			});

			// Only set authenticated if we get a successful response
			if (res.data && res.data.user) {
				setIsAuthenticated(true);
				setUser(res.data.user);
				setWasAuthenticatedOnce(true);
			} else {
				setIsAuthenticated(false);
				setUser(null);
			}
		} catch (err) {
			setIsAuthenticated(false);
			setUser(null);

			// Check if it's a session expired error
			if (err.response && err.response.status === 401 && wasAuthenticatedOnce) {
				setSessionExpired(true);
				setTimeout(() => setSessionExpired(false), 5000);
				router.replace('/login');
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const login = async (username, password) => {
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/auth/login`,
				{ username, password },
				{ withCredentials: true }
			);

			await checkAuth(); // Refresh auth state after login
			return { success: true };
		} catch (err) {
			return {
				success: false,
				error: err.response?.data?.error || 'Login failed',
			};
		}
	};

	const logout = async () => {
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/auth/logout`,
				{},
				{ withCredentials: true }
			);
			setIsAuthenticated(false);
			setUser(null);
		} catch (err) {
			console.error('Logout failed', err);
		}
	};

	const updateOwnPassword = async (currentPassword, newPassword) => {
		try {
			const res = await axios.put(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/self/password`,
				{ currentPassword, newPassword },
				{ withCredentials: true }
			);
			return { success: true, message: res.data.message };
		} catch (err) {
			return {
				success: false,
				error: err.response?.data?.error || 'Failed to update password',
			};
		}
	};

	const updateOwnUsername = async (username) => {
		try {
			const res = await axios.put(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/self/username`,
				{ username },
				{ withCredentials: true }
			);
			await checkAuth();
			return { success: true, message: res.data.message };
		} catch (err) {
			return {
				success: false,
				error: err.response?.data?.error || 'Failed to update username',
			};
		}
	};

	return (
		<>
			{sessionExpired && wasAuthenticatedOnce && (
				<div className='fixed top-4 right-4 z-50 bg-red outline-4 outline-bkg text-bkg p-4 rounded shadow-lg'>
					Session expired. Please log in again.
				</div>
			)}

			<AuthContext.Provider
				value={{
					user,
					isAuthenticated,
					loading,
					login,
					checkAuth,
					logout,
					updateOwnPassword,
					updateOwnUsername,
				}}>
				{!loading && children}
			</AuthContext.Provider>
		</>
	);
};

export const useAuth = () => useContext(AuthContext);
