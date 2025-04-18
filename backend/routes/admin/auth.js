import express from 'express';
import { tryLogin, getLogin, logout } from '../../api/auth/loginAPI.js';

const router = express.Router();

// GET /admin/auth/login
router.get('/login', getLogin);

// POST /admin/auth/login
router.post('/login', tryLogin);

// POST /admin/auth/logout
router.post('/logout', logout);

export default router;
