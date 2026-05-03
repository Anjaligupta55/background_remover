require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'snapcut_ai_secret_key_2024',
  REMOVE_BG_API_KEY: process.env.REMOVE_BG_API_KEY,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};
