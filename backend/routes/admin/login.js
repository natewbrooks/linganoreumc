import express from 'express';
import { tryLogin, getLogin } from '../../api/loginAPI.js';

const router = express.Router();

// GET /admin/login
router.get('/', getLogin);

// POST /admin/login
router.post('/', tryLogin);

export default router;
