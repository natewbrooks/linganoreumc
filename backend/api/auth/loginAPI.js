import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../database.js';

export const getLogin = (req, res) => {
	const token = req.cookies?.token;

	console.log('TOKEN FROM COOKIES: ' + token);

	if (!token) {
		console.log('NO TOKEN PROVIDED 401');
		return res.status(401).json({ error: 'No token provided' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
		return res.status(200).json({ message: 'Authenticated', user: decoded });
	} catch (err) {
		console.log('TOKEN DECODE FAILED 401');
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

		// 1 HOUR TOKEN
		const token = jwt.sign(
			{
				sub: user.id,
				username: user.username,
				role: user.role,
				permissions: [user.role],
			},
			process.env.JWT_SECRET || 'secret',
			{ expiresIn: '1h' } // ← 1 hour
		);

		// Cookie settings - these must be consistent across all methods
		const cookieOptions = {
			httpOnly: true,
			sameSite: 'None',
			secure: true, // Should be true for SameSite=None to work
			maxAge: 60 * 60 * 1000, // ← 1 hour in ms
			path: '/', // Explicitly set the path to ensure cookies are available for all routes
		};

		res.cookie('token', token, cookieOptions);

		res.status(200).json({ message: 'Login successful' });
	} catch (err) {
		console.error('Login error:', err);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export const logout = (req, res) => {
	// Use the SAME cookie options when clearing the cookie
	const cookieOptions = {
		httpOnly: true,
		sameSite: 'None',
		secure: true, // Match the setting used in tryLogin
		path: '/', // Explicitly set the path
	};

	res.clearCookie('token', cookieOptions);
	res.status(200).json({ message: 'Logged out' });
};
