import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import guard from 'express-jwt-permissions';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

import publicEventsRouter from './routes/public/events.js';
import publicSettingsRouter from './routes/public/settings.js';
import adminSettingsRouter from './routes/admin/settings.js';
import adminEventsRoute from './routes/admin/events.js';
import adminLoginRoute from './routes/admin/login.js';

import publicMediaRouter from './routes/public/media.js';
import adminMediaRouter from './routes/admin/media.js';

import verifyJWT from './middleware/verifyJWT.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Permissions guard instance
const permissionsGuard = guard({
	permissionsProperty: 'permissions',
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage setup using "media/images" folder
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, 'media', 'images'));
	},
	filename: (req, file, cb) => {
		// Replace spaces with hyphens (or perform any other sanitization)
		const sanitized = file.originalname.replace(/\s+/g, '-');
		cb(null, sanitized);
	},
});

const upload = multer({
	storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // Allow files up to 10MB
	},
});

// Public API Routes (No Authentication Needed)
app.use('/api/events/', publicEventsRouter);
app.use('/api/settings/', publicSettingsRouter);
app.use('/api/media/', publicMediaRouter);

// Admin Authentication Route (No JWT Needed)
app.use('/api/admin/login/', adminLoginRoute);

// Admin Protected Routes (JWT Required)
app.use('/api/admin/events/', adminEventsRoute);
app.use('/api/admin/settings/', adminSettingsRouter);
// Admin media route uses multer middleware for single file (field name "image")
app.use('/api/admin/media', upload.single('image'), adminMediaRouter);

// Example root endpoint
app.get('/api/', (req, res) => {
	res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
