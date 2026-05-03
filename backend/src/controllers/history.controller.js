const ImageHistory = require('../models/ImageHistory');
const fs = require('fs');
const path = require('path');

// @desc    Get user image history
// @route   GET /api/history
exports.getHistory = async (req, res, next) => {
  try {
    const history = await ImageHistory.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete single history item
// @route   DELETE /api/history/:id
exports.deleteHistoryItem = async (req, res, next) => {
  try {
    const item = await ImageHistory.findOne({ _id: req.params.id, user: req.user.id });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'History item not found'
      });
    }

    // Delete files
    const originalPath = path.join(__dirname, '../../', item.originalImage.substring(1));
    const processedPath = path.join(__dirname, '../../', item.processedImage.substring(1));

    if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
    if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);

    await item.deleteOne();

    res.json({
      success: true,
      message: 'History item deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all user history
// @route   DELETE /api/history
exports.clearHistory = async (req, res, next) => {
  try {
    const items = await ImageHistory.find({ user: req.user.id });

    for (const item of items) {
      const originalPath = path.join(__dirname, '../../', item.originalImage.substring(1));
      const processedPath = path.join(__dirname, '../../', item.processedImage.substring(1));

      if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
      if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);
    }

    await ImageHistory.deleteMany({ user: req.user.id });

    res.json({
      success: true,
      message: 'History cleared successfully'
    });
  } catch (error) {
    next(error);
  }
};
