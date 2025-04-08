import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import verifyJWT from './middleware/verifyJWT.js';
// import guard from 'express-jwt-permissions';

import publicEventsRouter from './routes/public/events.js';
import publicSermonsRouter from './routes/public/sermons.js';
import publicSettingsRouter from './routes/public/settings.js';
import adminSettingsRouter from './routes/admin/settings.js';
import adminEventsRoute from './routes/admin/events.js';
import adminSermonsRouter from './routes/admin/sermons.js';
import adminLoginRouter from './routes/admin/login.js';
import adminUsersRouter from './routes/admin/users.js';

import publicMediaRouter from './routes/public/media.js';
import adminMediaRouter from './routes/admin/media.js';

dotenv.config();
const app = express();

// Middleware
app.use(
	cors({
		origin: function (origin, callback) {
			const allowedOrigins = ['http://localhost', 'http://localhost:5173'];

			// Allow server-to-server or Postman with no origin
			if (!origin) {
				return callback(null, allowedOrigins[0]); // or pick your default trusted origin
			}

			if (allowedOrigins.includes(origin)) {
				return callback(null, origin);
			}

			callback(new Error('Not allowed by CORS'));
		},
		credentials: true,
	})
);

app.use(cookieParser());

app.use('/api/admin/media', adminMediaRouter);
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Permissions guard instance
// const permissionsGuard = guard({

// 	permissionsProperty: 'permissions',
// });

// Directory context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Public API Routes (No Authentication Needed)
app.use('/api/events/', publicEventsRouter);
app.use('/api/sermons/', publicSermonsRouter);
app.use('/api/settings/', publicSettingsRouter);
app.use('/api/media/', publicMediaRouter);

// Admin login (unprotected)
app.use('/api/admin/login/', adminLoginRouter);

// JWT middleware protection for all /api/admin routes
app.use((req, res, next) => {
	if (req.originalUrl.includes('/admin')) {
		verifyJWT(req, res, (err) => {
			if (err) {
				if (req.accepts('html')) {
					return res.redirect('http://localhost:5173/admin/login');
				} else {
					return res.status(401).json({ error: 'Unauthorized' });
				}
			}
			next();
		});
	} else {
		next();
	}
});

// Admin Protected Routes (JWT Required)
app.use('/api/admin/events/', adminEventsRoute);
app.use('/api/admin/sermons/', adminSermonsRouter);
app.use('/api/admin/settings/', adminSettingsRouter);

// Requires the admin role as well
app.use('/api/admin/users/', adminUsersRouter);

// Health check
app.get('/api/', (req, res) => {
	res.json({ message: 'API is working!' });
});

// Global error handler for multer and other uncaught errors
app.use((err, req, res, next) => {
	console.error('Global error handler:', err);
	if (err.name === 'MulterError') {
		return res.status(400).json({ error: err.message });
	}
	res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
