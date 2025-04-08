import express from 'express';
import { tryLogin, getLogin, logout } from '../../api/auth/loginAPI.js';

const router = express.Router();

// GET /api/admin/login
router.get('/', getLogin);

// POST /api/admin/login
router.post('/', tryLogin);

// POST /api/admin/login/logout/
router.post('/logout', logout);

export default router;
