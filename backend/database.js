import mysql from 'mysql2';
import dotenv from 'dotenv';

// Loads .env file into process.env
dotenv.config();

// Connection pools help reduce the time spent connecting to the MySQL server
// by reusing a previous connection, leaving them open instead of closing when
// you are done with them. This improves the latency of queries as you avoid all
// of the overhead that comes with establishing a new connection.
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT || 3306,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	dateStrings: true,
});

// Test the connection
pool.getConnection((err, connection) => {
	if (err) {
		console.error('Database connection failed:', err.message);
	} else {
		console.log('Connected to MySQL database.');
		connection.release(); // Release the connection back to the pool
	}
});

export default pool.promise(); // Use promise-based pool for async/await support
