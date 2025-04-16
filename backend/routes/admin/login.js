import express from 'express';
import { tryLogin, getLogin, logout } from '../../api/auth/loginAPI.js';

const router = express.Router();

// GET /admin/login
router.get('/', getLogin);

// POST /admin/login
router.post('/', tryLogin);

// POST /admin/login/logout/
router.post('/logout', logout);

export default router;
