import bcrypt from 'bcryptjs';
import pool from '../database.js';

export const createAdminUserIfMissing = async () => {
	try {
		const [rows] = await pool.execute('SELECT * FROM Users WHERE username = ?', ['admin']);
		if (rows.length > 0) {
			console.log('Admin user already exists. Skipping...');
			return;
		}

		const plainPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
		const hashedPassword = await bcrypt.hash(plainPassword, 10);

		await pool.execute('INSERT INTO Users (username, password, role) VALUES (?, ?, ?)', [
			'admin',
			hashedPassword,
			'admin',
		]);

		console.log('Admin user created successfully.');
	} catch (err) {
		console.error('Error creating admin user:', err.message);
	}
};
