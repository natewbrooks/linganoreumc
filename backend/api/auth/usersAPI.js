import bcrypt from 'bcryptjs';
import pool from '../../database.js';

// Admin-only
export const getAllUsers = async (req, res) => {
	try {
		const [rows] = await pool.execute('SELECT id, username, role FROM Users');
		res.status(200).json(rows);
	} catch (err) {
		console.error('Error fetching users:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const createUser = async (req, res) => {
	const { username, password, role } = req.body;
	if (!username || !password || !role) {
		return res.status(400).json({ error: 'Missing fields' });
	}

	const normalizedRole = role.toLowerCase();
	console.log('Creating user with role:', `"${normalizedRole}"`);

	if (!['admin', 'user'].includes(normalizedRole)) {
		return res.status(400).json({ error: 'Invalid role' });
	}

	try {
		const hashed = await bcrypt.hash(password, 10);
		await pool.execute('INSERT INTO Users (username, password, role) VALUES (?, ?, ?)', [
			username,
			hashed,
			normalizedRole,
		]);
		res.status(201).json({ message: 'User created successfully' });
	} catch (err) {
		console.error('Error creating user:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const updateUser = async (req, res) => {
	const { username, role } = req.body;
	const { id } = req.params;

	const normalizedRole = role.toLowerCase();
	if (!['admin', 'user'].includes(normalizedRole)) {
		return res.status(400).json({ error: 'Invalid role' });
	}

	try {
		await pool.execute('UPDATE Users SET username = ?, role = ? WHERE id = ?', [
			username,
			normalizedRole,
			id,
		]);
		res.status(200).json({ message: 'User updated' });
	} catch (err) {
		console.error('Error updating user:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const deleteUser = async (req, res) => {
	const { id } = req.params;
	try {
		await pool.execute('DELETE FROM Users WHERE id = ?', [id]);
		res.status(200).json({ message: 'User deleted' });
	} catch (err) {
		console.error('Error deleting user:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const resetUserPassword = async (req, res) => {
	const { password } = req.body;
	const { id } = req.params;

	if (!password) return res.status(400).json({ error: 'Missing password' });

	try {
		const hashed = await bcrypt.hash(password, 10);
		await pool.execute('UPDATE Users SET password = ? WHERE id = ?', [hashed, id]);
		res.status(200).json({ message: 'Password reset successfully' });
	} catch (err) {
		console.error('Admin password reset error:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};

// Self-service
export const updateOwnPassword = async (req, res) => {
	console.log('USER:', req.user);
	console.log('BODY:', req.body);
	const { currentPassword, newPassword } = req.body;
	const userId = req.user.id || req.user.sub;

	if (!currentPassword || !newPassword) {
		return res.status(400).json({ error: 'Missing fields' });
	}

	try {
		const [rows] = await pool.execute('SELECT password FROM Users WHERE id = ?', [userId]);
		if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

		const match = await bcrypt.compare(currentPassword, rows[0].password);
		if (!match) return res.status(401).json({ error: 'Incorrect current password' });

		const hashed = await bcrypt.hash(newPassword, 10);
		await pool.execute('UPDATE Users SET password = ? WHERE id = ?', [hashed, userId]);

		res.status(200).json({ message: 'Password updated successfully' });
	} catch (err) {
		console.error('Password update error:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const updateOwnUsername = async (req, res) => {
	const { username } = req.body;
	const userId = req.user.id || req.user.sub;

	if (!username) return res.status(400).json({ error: 'Missing username' });

	try {
		await pool.execute('UPDATE Users SET username = ? WHERE id = ?', [username, userId]);
		res.status(200).json({ message: 'Username updated successfully' });
	} catch (err) {
		console.error('Error updating username:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};
