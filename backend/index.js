import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { createAdminUserIfMissing } from './middleware/createUser.js';

import verifyJWT from './middleware/verifyJWT.js';
// import guard from 'express-jwt-permissions';

import publicEventsRouter from './routes/public/events.js';
import publicSermonsRouter from './routes/public/sermons.js';
import publicSettingsRouter from './routes/public/settings.js';

import adminSettingsRouter from './routes/admin/settings.js';
import adminEventsRoute from './routes/admin/events.js';
import adminSermonsRouter from './routes/admin/sermons.js';
import adminAuthRouter from './routes/admin/auth.js';
import adminUsersRouter from './routes/admin/users.js';

import publicMediaRouter from './routes/public/media.js';
import adminMediaRouter from './routes/admin/media.js';
import { buildImagePathCacheOnce } from './api/mediaAPI.js';

dotenv.config();
const app = express();

// Middleware
app.use(
	cors({
		origin: function (origin, callback) {
			const allowedOrigins = [
				process.env.BASE_URL,
				process.env.ADMIN_BASE_URL,
				process.env.API_BASE_URL,
				'http://localhost:3000',
				'http://localhost',
			];
			if (!origin || allowedOrigins.includes(origin)) {
				return callback(null, origin || true);
			}
			console.warn(`CORS blocked origin: ${origin}`);
			return callback(new Error('Not allowed by CORS'));
		},
		credentials: true,
	})
);

app.use(cookieParser());

app.use('/admin/media', adminMediaRouter);
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

(async () => {
	await createAdminUserIfMissing();
})();

// Public API Routes (No Authentication Needed)
app.use('/events', publicEventsRouter);
app.use('/sermons', publicSermonsRouter);
app.use('/settings', publicSettingsRouter);
app.use('/media', publicMediaRouter);

// Admin login (unprotected)
app.use('/admin/auth', adminAuthRouter);

// JWT middleware protection for all /admin routes
app.use((req, res, next) => {
	if (req.originalUrl.startsWith('/admin')) {
		verifyJWT(req, res, (err) => {
			if (err) {
				return res.status(401).json({ error: 'Unauthorized' });
			}
			next();
		});
	} else {
		next();
	}
});

// Admin Protected Routes (JWT Required)
app.use('/admin/events', adminEventsRoute);
app.use('/admin/sermons', adminSermonsRouter);
app.use('/admin/settings', adminSettingsRouter);

// Requires the admin role as well
app.use('/admin/users', adminUsersRouter);

// Global error handler for multer and other uncaught errors
app.use((err, req, res, next) => {
	console.error('Global error handler:', err);
	if (err.name === 'MulterError') {
		return res.status(400).json({ error: err.message });
	}
	res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	buildImagePathCacheOnce();
});
