const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { REMOVE_BG_API_KEY } = require('../config/env');
const deleteFile = require('../utils/deleteFile');
const ImageHistory = require('../models/ImageHistory');

exports.removeBackground = async (req, res, next) => {
  try {
    if (!REMOVE_BG_API_KEY || REMOVE_BG_API_KEY === 'your_remove_bg_api_key' || REMOVE_BG_API_KEY === '') {
      return res.status(500).json({
        success: false,
        message: 'Remove.bg API Key is missing or invalid in backend .env. Please add a real key.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    if (req.user.credits <= 0) {
      if (req.file) deleteFile(req.file.path);
      return res.status(403).json({
        success: false,
        message: 'No credits left. Please upgrade your plan or wait for renewal.'
      });
    }

    const inputPath = req.file.path;

    // Create form data for remove.bg API
    const formData = new FormData();
    formData.append('image_file', fs.createReadStream(inputPath));
    formData.append('size', 'auto');

    // Call remove.bg API
    const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      responseType: 'arraybuffer',
    });

    // Deduct credit and increment count
    req.user.credits -= 1;
    req.user.totalImagesProcessed += 1;
    await req.user.save();

    // Send processed image back to frontend IMMEDIATELY
    res.set('Content-Type', 'image/png');
    res.set('X-Credits-Left', req.user.credits.toString());
    res.send(response.data);

    // Save to History (Run in background for performance)
    const timestamp = Date.now();
    const safeName = req.file.originalname.replace(/\s+/g, '_');
    const originalFileName = `original_${timestamp}_${safeName}`;
    const processedFileName = `processed_${timestamp}_${safeName.replace(/\.[^/.]+$/, "")}.png`;

    const originalPath = path.join(__dirname, '../../uploads/history/original', originalFileName);
    const processedPath = path.join(__dirname, '../../uploads/history/processed', processedFileName);

    // Use async operations for background tasks
    (async () => {
      try {
        await fs.promises.copyFile(inputPath, originalPath);
        await fs.promises.writeFile(processedPath, response.data);
        
        await ImageHistory.create({
          user: req.user._id,
          originalImage: `/uploads/history/original/${originalFileName}`,
          processedImage: `/uploads/history/processed/${processedFileName}`,
          fileName: req.file.originalname,
          fileSize: req.file.size
        });

        // Delete temporary file
        deleteFile(inputPath);
      } catch (bgError) {
        console.error('Background History Saving Error:', bgError.message);
      }
    })();
    
  } catch (error) {
    console.error('❌ Background Removal Error:', error.message);
    
    // Clean up file on error
    if (req.file) {
      deleteFile(req.file.path);
    }

    if (error.response) {
      if (error.response.data instanceof Buffer) {
        try {
          const errorMsg = JSON.parse(error.response.data.toString());
          console.error('API Error details:', errorMsg);
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      if (error.response.status === 403) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or missing API Key for background removal'
        });
      }
    }

    next(error);
  }
};

exports.healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SnapCut AI backend is running'
  });
};
