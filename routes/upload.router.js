const { Router } = require('express');
const router = Router();
const { uploadFile, uploadAvatar } = require('../controllers/upload.controller');

router.post('/upload-file', uploadFile);
router.post('/upload-avatar', uploadAvatar);

module.exports = router;