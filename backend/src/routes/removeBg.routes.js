const express = require('express');
const router = express.Router();
const { removeBackground, healthCheck } = require('../controllers/removeBg.controller');
const upload = require('../middleware/upload.middleware');

router.get('/health', healthCheck);
router.post('/remove-bg', upload.single('image'), removeBackground);

module.exports = router;
