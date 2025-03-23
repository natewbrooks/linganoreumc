import express from 'express';
import { uploadImage, deleteImage } from '../../api/mediaAPI.js';

const router = express.Router();

// POST /api/admin/media/images/
router.post('/images/', uploadImage);

// POST /api/admin/media/images/:filename
router.delete('/images/:filename', deleteImage);

export default router;
