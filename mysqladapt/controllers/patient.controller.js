const patientDao = require('../dao/patient.dao');

const getAll = async (req, res) => {
  try {
    const patients = await patientDao.getAllPatients();
    res.json(patients);
  } catch (err) {
    console.error('GET ALL PATIENTS ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const patient = await patientDao.getPatientById(req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (err) {
    console.error('GET PATIENT BY ID ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    console.log('BODY RECIBIDO:', req.body);

    const {
      firstName,
      lastName,
      identification,
      birthDate,
      gender
    } = req.body;

    if (!firstName || !lastName || !identification || !birthDate || !gender) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const patient = await patientDao.createPatient(req.body);
    console.log('PACIENTE GUARDADO:', patient);

    res.status(201).json(patient);
  } catch (err) {
    console.error('CREATE PATIENT ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      identification,
      birthDate,
      gender
    } = req.body;

    if (!firstName || !lastName || !identification || !birthDate || !gender) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const patient = await patientDao.updatePatient(req.params.id, req.body);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(patient);
  } catch (err) {
    console.error('UPDATE PATIENT ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await patientDao.deletePatient(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    console.error('DELETE PATIENT ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
