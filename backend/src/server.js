const app = require('./app');
const { PORT } = require('./config/env');

app.listen(PORT, () => {
  console.log(`
  🚀 SnapCut AI Backend Running
  📡 Port: ${PORT}
  🌍 Mode: Development
  `);
});
