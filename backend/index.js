import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import guard from 'express-jwt-permissions';
import publicEventsRouter from './routes/public/events.js';
import adminEventsRouter from './routes/admin/events.js';
import loginRoute from './routes/admin/login.js';
import verifyJWT from './middleware/verifyJWT.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Create the permissions guard instance
const permissionsGuard = guard({
	permissionsProperty: 'permissions',
});

// Admin authentication and authorization middleware for /admin routes
app.use('/admin', (req, res, next) => {
	// Allow access to login route without JWT verification
	if (req.path.startsWith('/login')) {
		return next();
	}

	// Verify the JWT token.
	verifyJWT(req, res, (err) => {
		if (err) {
			return res.redirect('/admin/login');
		}
		// Check that the token includes the "admin" permission
		return permissionsGuard.check(['admin'])(req, res, next);
	});
});

// Restricted endpoints for admins
app.use('/admin/login', loginRoute);
app.use('/admin/events', adminEventsRouter);

// Public endpoints
app.use('/events', publicEventsRouter);

app.get('/', (req, res) => {
	res.send('hello');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
