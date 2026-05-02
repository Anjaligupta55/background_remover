require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  REMOVE_BG_API_KEY: process.env.REMOVE_BG_API_KEY,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};
