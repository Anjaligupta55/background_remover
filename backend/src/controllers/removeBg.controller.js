const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { REMOVE_BG_API_KEY } = require('../config/env');
const deleteFile = require('../utils/deleteFile');

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

    // Send processed image back to frontend
    res.set('Content-Type', 'image/png');
    res.send(response.data);

    // Delete temporary file
    deleteFile(inputPath);
    
  } catch (error) {
    // Clean up file on error
    if (req.file) {
      deleteFile(req.file.path);
    }

    if (error.response && error.response.status === 403) {
      res.status(403);
      return next(new Error('Invalid or missing API Key'));
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
