import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../database.js';

export const getLogin = (req, res) => {
	const token = req.cookies?.token;

	if (!token) {
		return res.status(401).json({ error: 'No token provided' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
		return res.status(200).json({ message: 'Authenticated', user: decoded });
	} catch (err) {
		return res.status(401).json({ error: 'Invalid or expired token' });
	}
};

export const tryLogin = async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ error: 'Missing username or password' });
	}

	try {
		const [rows] = await pool.execute('SELECT * FROM Users WHERE username = ?', [username]);

		if (rows.length === 0) {
			return res.status(401).json({ error: 'Invalid username or password' });
		}

		const user = rows[0];
		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) {
			return res.status(401).json({ error: 'Invalid username or password' });
		}

		const token = jwt.sign(
			{
				sub: user.id,
				username: user.username,
				role: user.role,
				permissions: [user.role],
			},
			process.env.JWT_SECRET || 'secret',
			{ expiresIn: '30m' }
		);

		res.cookie('token', token, {
			httpOnly: true,
			sameSite: 'Lax',
			secure: false,
			maxAge: 30 * 60 * 1000,
		});

		res.status(200).json({ message: 'Login successful' });
	} catch (err) {
		console.error('Login error:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const logout = (req, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		sameSite: 'Lax',
		secure: false, // set to true in production with HTTPS
	});
	res.status(200).json({ message: 'Logged out' });
};
