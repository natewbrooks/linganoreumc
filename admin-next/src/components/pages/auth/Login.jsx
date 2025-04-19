'use client';
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const { checkAuth } = useAuth();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/auth/login`,
				{ username, password },
				{ withCredentials: true }
			);

			setSuccess('Login successful!');
			setError('');
			await checkAuth(); // ensure session state updates
		} catch (err) {
			console.error(err);
			setError('Invalid credentials. Try again.');
			setSuccess('');
		}
	};

	return (
		<div className='flex flex-col w-full justify-center items-center'>
			<form
				onSubmit={handleLogin}
				className='flex flex-col space-y-2'>
				<h2 className='font-dm text-2xl text-center'>Admin Login</h2>

				<div className='flex space-x-1 items-center w-[300px] bg-bkg-tp skew-x-[30deg]'>
					<input
						type='text'
						name='username'
						autoComplete='username'
						autoFocus
						placeholder='Username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className='font-dm px-4 h-[32px] w-full outline-0 text-black text-md -skew-x-[30deg]'
						required
					/>
				</div>

				<div className='flex space-x-1 items-center w-[300px] bg-bkg-tp skew-x-[30deg]'>
					<input
						type='password'
						name='password'
						autoComplete='current-password'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='font-dm px-4 h-[32px] w-full outline-0 text-black text-md -skew-x-[30deg]'
						required
					/>
				</div>

				{error && <p className='font-dm text-red'>{error}</p>}
				{success && <p className='font-dm text-green-500'>{success}</p>}

				<div className='flex w-full justify-end'>
					<button
						type='submit'
						className='font-dm flex bg-red px-4 text-bkg clickable-r-skew'>
						<div className='-skew-x-[30deg]'>Submit</div>
					</button>
				</div>
			</form>
		</div>
	);
}

export default Login;
