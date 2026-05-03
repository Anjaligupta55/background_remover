const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = require('./app');
const { PORT, MONGO_URI } = require('./config/env');

// Ensure upload directories exist
const uploadDirs = [
  'uploads',
  'uploads/history/original',
  'uploads/history/processed'
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`
      🚀 SnapCut AI Backend Running
      📡 Port: ${PORT}
      🌍 Mode: Development
      `);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });
