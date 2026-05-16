require('dotenv').config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

module.exports = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ROOT',
  database: process.env.DB_NAME || 'meditrack',
  port: toNumber(process.env.DB_PORT, 3306),
  waitForConnections: true,
  connectionLimit: toNumber(process.env.DB_CONNECTION_LIMIT, 10),
  queueLimit: 0
};
