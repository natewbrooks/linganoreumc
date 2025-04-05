import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import guard from 'express-jwt-permissions';
import path from 'path';
import { fileURLToPath } from 'url';

import publicEventsRouter from './routes/public/events.js';
import publicSermonsRouter from './routes/public/sermons.js';
import publicSettingsRouter from './routes/public/settings.js';
import adminSettingsRouter from './routes/admin/settings.js';
import adminEventsRoute from './routes/admin/events.js';
import adminSermonsRouter from './routes/admin/sermons.js';
import adminLoginRoute from './routes/admin/login.js';

import publicMediaRouter from './routes/public/media.js';
import adminMediaRouter from './routes/admin/media.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());

app.use('/api/admin/media', adminMediaRouter);
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Permissions guard instance
const permissionsGuard = guard({
	permissionsProperty: 'permissions',
});

// Directory context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Public API Routes (No Authentication Needed)
app.use('/api/events/', publicEventsRouter);
app.use('/api/sermons/', publicSermonsRouter);
app.use('/api/settings/', publicSettingsRouter);
app.use('/api/media/', publicMediaRouter);

// Admin Authentication Route (No JWT Needed)
app.use('/api/admin/login/', adminLoginRoute);

// Admin Protected Routes (JWT Required)
app.use('/api/admin/events/', adminEventsRoute);
app.use('/api/admin/sermons/', adminSermonsRouter);
app.use('/api/admin/settings/', adminSettingsRouter);

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
