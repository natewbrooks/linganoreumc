import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Search from '../../components/ui/Search';
import Filter from '../../components/ui/Filter';
import SkewedSelectToggle from '../../components/ui/SkewedSelectToggle';
import { FaTrashCan, FaPlus } from 'react-icons/fa6';
import { FaKey, FaPen } from 'react-icons/fa';
import Unauthorized from '../misc/Unauthorized';

function Users() {
	const { user, resetUserPassword } = useAuth();
	const [users, setUsers] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [newPassword, setNewPassword] = useState('');
	const [feedback, setFeedback] = useState('');
	const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
	const [addPanelVisible, setAddPanelVisible] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [filter, setFilter] = useState('all');
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [editNameModal, setEditNameModal] = useState(null);
	const [editedUsername, setEditedUsername] = useState('');

	const [newUserModal, setNewUserModal] = useState(false);
	const [confirmModal, setConfirmModal] = useState(null);

	const filterOptions = ['all', 'admin', 'user', 'alpha', 'id'];
	useEffect(() => {
		if (user?.role === 'admin') {
			axios
				.get(`${import.meta.env.VITE_API_BASE_URL}/admin/users`, { withCredentials: true })
				.then((res) => setUsers(res.data))
				.catch((err) => console.error(err));
		}
	}, [user]);

	if (user?.role !== 'admin') return <Unauthorized />;

	const handleResetPassword = async (id) => {
		const res = await resetUserPassword(id, newPassword);
		setFeedback(res.success ? res.message : res.error);
		if (res.success) {
			setNewPassword('');
			setEditingId(null);
			setConfirmModal(null);
		}
	};

	const handleCreateUser = async () => {
		try {
			const res = await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/admin/users`,
				{ ...newUser, role: newUser.role.toLowerCase() },
				{ withCredentials: true }
			);
			setFeedback(res.data.message);
			setNewUser({ username: '', password: '', role: 'user' });

			const updated = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/users`, {
				withCredentials: true,
			});
			setUsers(updated.data);

			setNewUserModal(false); // close modal
		} catch (err) {
			setFeedback(err.response?.data?.error || 'Error creating user');
		}
	};

	const handleDeleteUser = async (id) => {
		if (!window.confirm('Are you sure you want to delete this user?')) return;
		try {
			await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/admin/users/${id}`, {
				withCredentials: true,
			});
			setFeedback('User deleted');
			setUsers(users.filter((u) => u.id !== id));
		} catch (err) {
			setFeedback(err.response?.data?.error || 'Error deleting user');
		}
	};

	const handleDeleteSelected = async () => {
		if (!window.confirm('Delete selected users?')) return;
		for (const id of selectedUsers) {
			await handleDeleteUser(id);
		}
		setSelectedUsers([]);
	};

	let filtered = [...users];

	if (filter === 'admin') filtered = filtered.filter((u) => u.role === 'admin');
	if (filter === 'user') filtered = filtered.filter((u) => u.role === 'user');
	if (filter === 'alpha') filtered = filtered.sort((a, b) => a.username.localeCompare(b.username));
	if (filter === 'id') filtered = filtered.sort((a, b) => a.id - b.id);

	filtered = filtered.filter((u) => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className='flex flex-col space-y-6 px-4'>
			<div className='flex flex-col'>
				<div className='font-dm text-2xl'>Manage Users ({filtered.length})</div>
				<div className='font-dm text-md'>Create, update, or remove user accounts</div>
			</div>
			<div className='flex flex-col space-y-1'>
				<div className='flex flex-row items-center justify-between'>
					<Search />
					<div className='flex space-x-1 items-center h-[32px]'>
						<div
							onClick={handleDeleteSelected}
							className={`${
								selectedUsers.length > 0
									? 'bg-red text-bkg clickable   '
									: 'text-darkred/50 bg-bkg-tp cursor-not-allowed'
							} transition font-dm text-md h-full text-center w-fit px-3 py-1 skew-x-[30deg]`}>
							<div className='flex space-x-1 h-full -skew-x-[30deg] items-center'>
								<FaTrashCan size={16} />
							</div>
						</div>
						<div
							onClick={() => setNewUserModal(true)}
							className='clickable    font-dm text-bkg text-md text-end h-full w-fit bg-red px-3 py-1 skew-x-[30deg]'>
							<div className='flex space-x-1 -skew-x-[30deg] items-center'>
								<FaPlus size={16} />
								<div>Add</div>
							</div>
						</div>
					</div>
				</div>

				<Filter
					filter={filter}
					setFilter={setFilter}
					filterOptions={filterOptions}
				/>
			</div>

			<div className='my-2 flex flex-col space-y-4 px-6 min-h-[800px]'>
				{filtered.length > 0 ? (
					filtered.map((u) => (
						<div
							key={u.id}
							className='flex relative items-center justify-center'>
							{u.username !== user.username && (
								<div className='absolute -left-4 top-1'>
									<SkewedSelectToggle
										id={u.id}
										selectedList={selectedUsers}
										setSelectedList={setSelectedUsers}
									/>
								</div>
							)}
							<div className='w-full flex flex-row items-center bg-tp -skew-x-[30deg] relative text-md md:text-lg'>
								<div className='font-dm py-2 text-bkg min-w-[45px] md:min-w-[80px] overflow-hidden text-center relative bg-darkred px-4'>
									<p className='block md:hidden skew-x-[30deg] whitespace-nowrap'>{u.id}</p>
									<p className='hidden md:block skew-x-[30deg] whitespace-nowrap'>uid: {u.id}</p>
								</div>
								<div className='font-dm py-2 text-bkg bg-red px-4 text-center overflow-visible whitespace-nowrap skew-x-0'>
									<p className='skew-x-[30deg]'>{u.role}</p>
								</div>
								<div className={`flex w-full justify-between items-center`}>
									<div className='p-2 pl-4 font-dm items-center whitespace-nowrap text-darkred overflow-hidden'>
										<p className='skew-x-[30deg]'>
											{u.username === user.username ? (
												<span>
													{u.username} <span className={`italic text-xs md:text-sm`}> (you)</span>
												</span>
											) : (
												u.username
											)}
										</p>
									</div>
									{u.username !== user.username && (
										<div className={`flex`}>
											<button
												onClick={() => {
													setEditNameModal({ id: u.id, username: u.username });
													setEditedUsername(u.username);
												}}
												className='text-darkred hover:underline pr-4 skew-x-[30deg] clickable   '>
												<FaPen />
											</button>
											<button
												onClick={() => {
													setEditingId(u.id);
													setConfirmModal({ id: u.id, username: u.username });
												}}
												className='text-darkred hover:underline pr-4 skew-x-[30deg] clickable   '>
												<FaKey />
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					))
				) : (
					<div className='w-full flex justify-center items-center'>
						<span className='italic font-dm text-darkred'>No {filter} users.</span>
					</div>
				)}
			</div>

			{newUserModal && (
				<div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
					<div className='bg-bkg shadow-lg p-6 max-w-md w-full space-y-4 h-[400px] -skew-x-[10deg]'>
						<div className='flex flex-col w-full h-full justify-evenly skew-x-[10deg] px-12 font-dm'>
							<h2 className='text-xl text-red text-center'>Create New User</h2>

							{/* Username */}
							<div className={`flex flex-col space-y-2`}>
								<div className='bg-tp w-full skew-x-[30deg]'>
									<input
										type='text'
										placeholder='Username'
										value={newUser.username}
										onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
										className='py-1 w-full -skew-x-[30deg] px-4 outline-none'
									/>
								</div>

								{/* Password */}
								<div className='bg-tp w-full skew-x-[30deg]'>
									<input
										type='password'
										placeholder='Password'
										value={newUser.password}
										onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
										className='py-1 w-full -skew-x-[30deg] px-4 outline-none'
									/>
								</div>
							</div>

							{/* Role */}
							<div className={``}>
								<div>Select Role</div>
								<select
									value={newUser.role}
									onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
									className='border px-2 py-1 rounded w-full'>
									<option value='user'>User</option>
									<option value='admin'>Admin</option>
								</select>
							</div>

							{/* Feedback */}
							{feedback && <p className='text-sm text-darkred text-center'>{feedback}</p>}

							{/* Buttons */}
							<div className='flex justify-end space-x-2'>
								<button
									onClick={() => {
										setNewUserModal(false);
										setFeedback('');
										setNewUser({ username: '', password: '', role: 'user' });
									}}
									className='px-3 py-1 bg-bkg-tp text-darkred -skew-x-[30deg] clickable   '>
									<div className='skew-x-[30deg]'>Cancel</div>
								</button>
								<button
									onClick={() => {
										const proceed = window.confirm(
											`Are you sure you want to create new user "${newUser.username}" as ${newUser.role}?`
										);
										if (proceed) handleCreateUser();
									}}
									className='px-3 py-1 bg-red text-white -skew-x-[30deg] clickable   '>
									<div className='skew-x-[30deg]'>Submit</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{editNameModal && (
				<div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
					<div className='bg-bkg shadow-lg p-6 max-w-md w-full space-y-4 h-[260px] -skew-x-[10deg]'>
						<div className='flex flex-col w-full h-full justify-evenly skew-x-[10deg] px-12 font-dm'>
							<h2 className='text-xl text-red text-center'>Edit Username</h2>
							<p className='text-center text-sm text-darkred'>User ID: {editNameModal.id}</p>
							<div className={`bg-tp w-full skew-x-[30deg]`}>
								<input
									type='text'
									value={editedUsername}
									onChange={(e) => setEditedUsername(e.target.value)}
									className='py-1 w-full -skew-x-[30deg] px-4 outline-none'
								/>
							</div>
							<div className='flex justify-end space-x-2'>
								<button
									onClick={() => setEditNameModal(null)}
									className='px-3 py-1 bg-bkg-tp text-darkred -skew-x-[30deg] clickable   '>
									<div className='skew-x-[30deg]'>Cancel</div>
								</button>
								<button
									onClick={async () => {
										const confirmed = window.confirm(`Update username to "${editedUsername}"?`);
										if (!confirmed) return;

										try {
											await axios.put(
												`${import.meta.env.VITE_API_BASE_URL}/admin/users/${editNameModal.id}`,
												{
													username: editedUsername,
													role: users.find((u) => u.id === editNameModal.id)?.role,
												},
												{ withCredentials: true }
											);
											const updated = await axios.get(
												`${import.meta.env.VITE_API_BASE_URL}/admin/users`,
												{
													withCredentials: true,
												}
											);
											setUsers(updated.data);
											setFeedback('Username updated');
											setEditNameModal(null);
										} catch (err) {
											setFeedback(err.response?.data?.error || 'Error updating username');
										}
									}}
									className='px-3 py-1 bg-red text-white -skew-x-[30deg] clickable   '>
									<div className='skew-x-[30deg]'>Confirm</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{confirmModal && (
				<div className='fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50'>
					<div className='bg-bkg shadow-lg p-6 max-w-md h-[320px] w-full space-y-4 -skew-x-[10deg]'>
						<div
							className={`flex flex-col w-full h-full justify-evenly skew-x-[10deg] px-12 font-dm`}>
							<h2 className='text-xl text-red text-center'>Change User Password</h2>
							<div className={`flex flex-col`}>
								<p className='text-md'>User ID: {confirmModal.id}</p>
								<p className='text-md'>Username: {confirmModal.username}</p>
							</div>
							<div className={`bg-tp w-full skew-x-[30deg]`}>
								<input
									type='password'
									placeholder='New password'
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									className='py-1 w-full -skew-x-[30deg] px-4 outline-none'
								/>
							</div>
							<div className='flex justify-end space-x-2'>
								<button
									onClick={() => setConfirmModal(null)}
									className='px-3 py-1 bg-bkg-tp text-darkred -skew-x-[30deg] clickable   '>
									<div className={`skew-x-[30deg]`}>Cancel</div>
								</button>
								<button
									onClick={() => {
										const proceed = window.confirm(
											`Are you sure you want to change the password for user "${confirmModal.username}"?`
										);
										if (proceed) handleResetPassword(confirmModal.id);
									}}
									className='px-3 py-1 bg-red text-white -skew-x-[30deg] clickable   '>
									<div className={`skew-x-[30deg]`}>Confirm</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Users;
