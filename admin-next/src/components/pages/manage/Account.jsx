'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import NotFound from '../misc/NotFound';

function Account() {
	const { user, updateOwnPassword, updateOwnUsername } = useAuth();

	const [username, setUsername] = useState(user.username);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [feedback, setFeedback] = useState('');

	if (!user) return <NotFound />;

	return (
		<div className='flex justify-center items-center w-full font-dm'>
			<div className='flex flex-col space-y-4 w-[280px]'>
				<div className='flex flex-col space-y-2'>
					<h1 className='text-2xl'>My Account</h1>

					<div>
						<p className='font-medium'>Username:</p>
						<div className='bg-tp w-full skew-x-[30deg] mt-1'>
							<input
								type='text'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className='py-1 w-full -skew-x-[30deg] px-4 outline-none'
							/>
						</div>
					</div>
				</div>

				<div className='flex flex-col w-full space-y-2'>
					<p className='font-medium'>Password:</p>
					<div className='bg-tp w-full skew-x-[30deg]'>
						<input
							type='password'
							placeholder='Current password'
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							className='py-1 w-full -skew-x-[30deg] px-4 outline-none'
						/>
					</div>
					<div className='bg-tp w-full skew-x-[30deg]'>
						<input
							type='password'
							placeholder='New password'
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className='py-1 w-full -skew-x-[30deg] px-4 outline-none'
						/>
					</div>
				</div>

				{feedback && <div className='text-sm text-red'>{feedback}</div>}

				<div className='flex w-full justify-end'>
					<button
						onClick={async () => {
							const usernameChanged = username.trim() !== user.username;
							const passwordChanged = currentPassword && newPassword;

							if (!usernameChanged && !passwordChanged) {
								setFeedback('No changes to submit.');
								return;
							}

							const confirm = window.confirm('Apply changes to your account?');
							if (!confirm) return;

							let resultMessages = [];

							if (usernameChanged) {
								const res = await updateOwnUsername(username);
								if (!res.success) return setFeedback(`Username: ${res.error}`);
								resultMessages.push('Username updated');
							}

							if (passwordChanged) {
								const res = await updateOwnPassword(currentPassword, newPassword);
								if (!res.success) return setFeedback(`Password: ${res.error}`);
								resultMessages.push('Password updated');
								setCurrentPassword('');
								setNewPassword('');
							}

							setFeedback(resultMessages.join('. ') + '.');
						}}
						className='px-3 py-1 bg-red text-white -skew-x-[30deg] clickable   '>
						<div className='skew-x-[30deg]'>Confirm Changes</div>
					</button>
				</div>
			</div>
		</div>
	);
}

export default Account;
