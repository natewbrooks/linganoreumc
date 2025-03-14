import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import guard from 'express-jwt-permissions';
import publicEventsRouter from './routes/public/events.js';
import adminEventsRoute from './routes/admin/events.js';
import adminLoginRoute from './routes/admin/login.js';
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

// Public API Routes (No Authentication Needed)
app.use('/api/events/', publicEventsRouter);

// Admin Authentication Route (No JWT Needed)
app.use('/api/admin/login/', adminLoginRoute);

// Admin Protected Routes (JWT Required)
// app.use('/api/admin', verifyJWT, permissionsGuard.check(['admin']), adminEventsRouter);

app.use('/api/admin/events/', adminEventsRoute);

app.get('/api/', (req, res) => {
	res.json({ message: 'API is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
