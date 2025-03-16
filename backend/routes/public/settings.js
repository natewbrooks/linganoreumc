import express from 'express';
import { getGeneralSettings, getHomepageSettings } from '../../api/settings/settingsAPI.js';

const router = express.Router();

// GETs /api/settings/general - Get general settings
router.get('/general/', getGeneralSettings);

// GETs /api/settings/pages/home/ - Get homepage settings
router.get('/pages/home/', getHomepageSettings);

export default router;
