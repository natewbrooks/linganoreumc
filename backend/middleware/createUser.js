import bcrypt from 'bcryptjs';
import pool from '../database.js';

export const createUser = async () => {
	try {
		const username = 'admin';
		const plainPassword = 'adminpass';
		const hashedPassword = await bcrypt.hash(plainPassword, 10);

		await pool.execute('INSERT INTO Users (username, password, role) VALUES (?, ?, ?)', [
			username,
			hashedPassword,
			'admin',
		]);

		console.log('User created successfully.');
	} catch (err) {
		console.error('Error creating user:', err.message);
	} finally {
		await pool.end();
	}
};
