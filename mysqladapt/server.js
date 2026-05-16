const app = require('./app');
const db = require('./services/mysql.service');

const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  try {
    await db.verifyConnection();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a MySQL. Revisa variables DB_* y estado del servidor.', error.message);
    process.exit(1);
  }
};

start();
