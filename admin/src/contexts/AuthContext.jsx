import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [sessionExpired, setSessionExpired] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	// Check login status
	const checkAuth = async () => {
		try {
			const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/login`, {
				withCredentials: true,
			});
			setIsAuthenticated(true);
			setUser(res.data.user); // user contains username and role
		} catch (err) {
			setIsAuthenticated(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		checkAuth(); // Initial check when app loads

		const interceptor = axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response?.status === 401) {
					setIsAuthenticated(false);
					setSessionExpired(true);
					// Optionally, navigate('/login');
				}
				return Promise.reject(error);
			}
		);

		return () => {
			axios.interceptors.response.eject(interceptor);
		};
	}, []);

	useEffect(() => {
		if (loading) return;

		const onLoginPage = location.pathname === '/login';

		// If not logged in and not on login page, redirect
		if (!isAuthenticated && !onLoginPage) {
			navigate('/login');
		}

		// If logged in and on login page, delay redirect
		if (isAuthenticated && onLoginPage) {
			navigate('/settings/general/');
		}
	}, [isAuthenticated, loading, location.pathname, navigate]);

	const logout = async () => {
		try {
			await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/admin/login/logout`,
				{},
				{ withCredentials: true }
			);
			setIsAuthenticated(false);
			navigate('/login');
		} catch (err) {
			console.error('Logout failed', err);
		}
	};

	// API: user changing their own password
	const updateOwnPassword = async (currentPassword, newPassword) => {
		try {
			const res = await axios.put(
				`${import.meta.env.VITE_API_BASE_URL}/admin/users/self/password`,
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

	// API: user changing their own username
	const updateOwnUsername = async (username) => {
		try {
			const res = await axios.put(
				`${import.meta.env.VITE_API_BASE_URL}/admin/users/self/username`,
				{ username },
				{ withCredentials: true }
			);
			await checkAuth(); // Refresh local user state
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
			{sessionExpired && (
				<div className='fixed top-4 right-4 z-50 bg-red text-white p-4 rounded shadow-lg'>
					Session expired. Please log in again.
				</div>
			)}

			<AuthContext.Provider
				value={{
					user,
					isAuthenticated,
					loading,
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
