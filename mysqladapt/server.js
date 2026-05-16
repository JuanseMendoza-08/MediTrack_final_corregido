const express = require('express');
const path = require('path');
const patientRoutes = require('./routes/patient.routes');
const db = require('./services/mysql.service');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/patients', patientRoutes);
app.use('/api/pacientes', patientRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/pacientes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pacientes.html'));
});

app.get('/nuevo-paciente', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'nuevo-paciente.html'));
});

app.get('/detalle-paciente', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'detalle-paciente.html'));
});

app.get('/logout', (req, res) => {
  res.redirect('/');
});

app.get('/dashboard.html', (req, res) => res.redirect('/dashboard'));
app.get('/pacientes.html', (req, res) => res.redirect('/pacientes'));
app.get('/nuevo-paciente.html', (req, res) => res.redirect('/nuevo-paciente'));
app.get('/detalle-paciente.html', (req, res) => {
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  res.redirect(`/detalle-paciente${query}`);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = Number(err.statusCode) || 500;

  if (statusCode >= 500) {
    console.error('UNHANDLED ERROR:', err);
  }

  return res.status(statusCode).json({
    error: err.message || 'Internal Server Error'
  });
});

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
