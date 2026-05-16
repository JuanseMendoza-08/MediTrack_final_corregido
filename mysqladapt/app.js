const express = require('express');
const path = require('path');
const patientRoutes = require('./routes/patient.routes');
const notFound = require('./middlewares/notFound.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

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

app.use(notFound);
app.use(errorHandler);

module.exports = app;
