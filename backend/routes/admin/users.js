import express from 'express';
import verifyJWT from '../../middleware/verifyJWT.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import {
	getAllUsers,
	createUser,
	updateUser,
	deleteUser,
	updateOwnPassword,
	resetUserPassword,
	updateOwnUsername,
} from '../../api/auth/usersAPI.js';

const router = express.Router();

router.use(verifyJWT);

// Self-service password update
router.put('/self/password', updateOwnPassword);
router.put('/self/username', updateOwnUsername);

// Admin-only routes
router.get('/', requireAdmin, getAllUsers);
router.post('/', requireAdmin, createUser);
router.put('/:id', requireAdmin, updateUser);
router.delete('/:id', requireAdmin, deleteUser);
router.put('/:id/password', requireAdmin, resetUserPassword);

export default router;
