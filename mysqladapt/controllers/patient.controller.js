const patientDao = require('../dao/patient.dao');

const requiredFields = ['firstName', 'lastName', 'identification', 'birthDate', 'gender'];

const validatePatientPayload = (payload = {}) => {
  for (const field of requiredFields) {
    const value = payload[field];

    if (typeof value !== 'string' || value.trim() === '') {
      const error = new Error(`Missing required field: ${field}`);
      error.statusCode = 400;
      throw error;
    }
  }
};

const getAll = async (req, res, next) => {
  try {
    const patients = await patientDao.getAllPatients();
    return res.json(patients);
  } catch (err) {
    return next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const patient = await patientDao.getPatientById(req.params.id);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    return res.json(patient);
  } catch (err) {
    return next(err);
  }
};

const create = async (req, res, next) => {
  try {
    validatePatientPayload(req.body);

    const patient = await patientDao.createPatient(req.body);
    return res.status(201).json(patient);
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    validatePatientPayload(req.body);

    const patient = await patientDao.updatePatient(req.params.id, req.body);

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    return res.json(patient);
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await patientDao.deletePatient(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    return res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
