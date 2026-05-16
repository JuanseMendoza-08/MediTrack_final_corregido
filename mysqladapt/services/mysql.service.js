const mysql = require('mysql2/promise');
const config = require('../env/mysqlConfig');

const pool = mysql.createPool(config);

const verifyConnection = async () => {
  const connection = await pool.getConnection();

  try {
    await connection.ping();
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  query: (...args) => pool.query(...args),
  verifyConnection
};
