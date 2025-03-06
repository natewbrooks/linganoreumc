import jwt from 'jsonwebtoken';

// This will be an SQL table
const users = [{ username: 'admin', password: 'adminpass', permissions: ['admin'] }];

export const tryLogin = (req, res) => {
	const { username, password } = req.body;

	// Validate credentials against the temporary db
	const user = users.find((u) => u.username === username && u.password === password);

	if (user) {
		// Dynamically generate a JWT with the user's permissions
		const token = jwt.sign(
			{ username: user.username, permissions: user.permissions },
			process.env.JWT_SECRET || 'secret',
			{ algorithm: 'HS256', expiresIn: '1h' }
		);

		res.cookie('token', token, { httpOnly: true });

		// Redirect to default admin page
		return res.redirect('/admin/events');
	} else {
		// On failure, re‑render the login page with an error message
		return res.send(`
      <html>
        <body>
          <h1>Admin Login</h1>
          <p style="color:red;">Invalid credentials. Please try again.</p>
          <form method="POST" action="/admin/login">
            <label>Username: <input type="text" name="username" required /></label><br/>
            <label>Password: <input type="password" name="password" required /></label><br/>
            <button type="submit">Login</button>
          </form>
        </body>
      </html>
    `);
	}
};

export const getLogin = (req, res) => {
	res.send(`
    <html>
      <body>
        <h1>Admin Login</h1>
        <form method="POST" action="/admin/login">
          <label>Username: <input type="text" name="username" required /></label><br/>
          <label>Password: <input type="password" name="password" required /></label><br/>
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `);
};
