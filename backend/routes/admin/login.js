import express from 'express';
import { tryLogin, getLogin } from '../../api/loginAPI.js';

const router = express.Router();

// GET /api/admin/login
router.get('/', getLogin);

// POST /api/admin/login
router.post('/', tryLogin);

export default router;
