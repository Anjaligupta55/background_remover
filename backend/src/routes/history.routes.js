const express = require('express');
const router = express.Router();
const { getHistory, deleteHistoryItem, clearHistory } = require('../controllers/history.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All history routes are protected

router.get('/', getHistory);
router.delete('/', clearHistory);
router.delete('/:id', deleteHistoryItem);

module.exports = router;
