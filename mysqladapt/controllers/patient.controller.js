const patientDao = require('../dao/patient.dao');
const asyncHandler = require('../utils/asyncHandler');
const validatePatientPayload = require('../utils/validatePatientPayload');

const getAll = asyncHandler(async (req, res) => {
  const patients = await patientDao.getAllPatients();
  res.json(patients);
});

const getById = asyncHandler(async (req, res) => {
  const patient = await patientDao.getPatientById(req.params.id);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  return res.json(patient);
});

const create = asyncHandler(async (req, res) => {
  validatePatientPayload(req.body);

  const patient = await patientDao.createPatient(req.body);
  res.status(201).json(patient);
});

const update = asyncHandler(async (req, res) => {
  validatePatientPayload(req.body);

  const patient = await patientDao.updatePatient(req.params.id, req.body);

  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  return res.json(patient);
});

const remove = asyncHandler(async (req, res) => {
  const deleted = await patientDao.deletePatient(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  return res.json({ message: 'Patient deleted successfully' });
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
