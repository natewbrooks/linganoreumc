import express from 'express';
import { updateGeneralSettings, updateHomepageSettings } from '../../api/settings/settingsAPI.js';

const router = express.Router();

// PUT /api/admin/settings/general/ - Update general settings (admin only)
router.put('/general/', updateGeneralSettings);
// PUT /api/admin/settings/general/ - Update homepage settings (admin only)
router.put('/pages/home/', updateHomepageSettings);

export default router;
