const db = require('../services/mysql.service');

const getAllPatients = async () => {
  const [rows] = await db.query(`
    SELECT 
      patient_id AS id,
      first_name AS firstName,
      last_name AS lastName,
      CONCAT(first_name, ' ', last_name) AS fullName,
      identification,
      DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate,
      DATE_FORMAT(birth_date, '%d/%m/%Y') AS birthDateFormatted,
      gender,
      blood_type AS bloodType,
      phone,
      email,
      address,
      emergency_contact AS emergencyContact,
      emergency_phone AS emergencyPhone,
      insurance_provider AS insuranceProvider,
      allergies,
      medical_history AS medicalHistory,
      notes,
      'Today' AS lastVisit,
      created_at
    FROM patient
    ORDER BY patient_id DESC
  `);

  return rows;
};

const getPatientById = async (id) => {
  const [rows] = await db.query(`
    SELECT 
      patient_id AS id,
      first_name AS firstName,
      last_name AS lastName,
      CONCAT(first_name, ' ', last_name) AS fullName,
      identification,
      DATE_FORMAT(birth_date, '%Y-%m-%d') AS birthDate,
      DATE_FORMAT(birth_date, '%d/%m/%Y') AS birthDateFormatted,
      gender,
      blood_type AS bloodType,
      phone,
      email,
      address,
      emergency_contact AS emergencyContact,
      emergency_phone AS emergencyPhone,
      insurance_provider AS insuranceProvider,
      allergies,
      medical_history AS medicalHistory,
      notes,
      'Today' AS lastVisit,
      created_at
    FROM patient
    WHERE patient_id = ?
  `, [id]);

  return rows[0] || null;
};

const createPatient = async (patientData) => {
  const {
    firstName,
    lastName,
    identification,
    birthDate,
    gender,
    bloodType,
    phone,
    email,
    address,
    emergencyContact,
    emergencyPhone,
    insuranceProvider,
    allergies,
    medicalHistory,
    notes
  } = patientData;

  const [result] = await db.query(`
    INSERT INTO patient (
      first_name,
      last_name,
      identification,
      birth_date,
      gender,
      blood_type,
      phone,
      email,
      address,
      emergency_contact,
      emergency_phone,
      insurance_provider,
      allergies,
      medical_history,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    firstName ? firstName.trim() : '',
    lastName ? lastName.trim() : '',
    identification ? identification.trim() : '',
    birthDate || '',
    gender ? gender.trim() : '',
    bloodType ? bloodType.trim() : '',
    phone ? phone.trim() : '',
    email ? email.trim() : '',
    address ? address.trim() : '',
    emergencyContact ? emergencyContact.trim() : '',
    emergencyPhone ? emergencyPhone.trim() : '',
    insuranceProvider ? insuranceProvider.trim() : '',
    allergies ? allergies.trim() : '',
    medicalHistory ? medicalHistory.trim() : '',
    notes ? notes.trim() : ''
  ]);

  return getPatientById(result.insertId);
};

const updatePatient = async (id, patientData) => {
  const {
    firstName,
    lastName,
    identification,
    birthDate,
    gender,
    bloodType,
    phone,
    email,
    address,
    emergencyContact,
    emergencyPhone,
    insuranceProvider,
    allergies,
    medicalHistory,
    notes
  } = patientData;

  const [result] = await db.query(`
    UPDATE patient
    SET
      first_name = ?,
      last_name = ?,
      identification = ?,
      birth_date = ?,
      gender = ?,
      blood_type = ?,
      phone = ?,
      email = ?,
      address = ?,
      emergency_contact = ?,
      emergency_phone = ?,
      insurance_provider = ?,
      allergies = ?,
      medical_history = ?,
      notes = ?
    WHERE patient_id = ?
  `, [
    firstName ? firstName.trim() : '',
    lastName ? lastName.trim() : '',
    identification ? identification.trim() : '',
    birthDate || '',
    gender ? gender.trim() : '',
    bloodType ? bloodType.trim() : '',
    phone ? phone.trim() : '',
    email ? email.trim() : '',
    address ? address.trim() : '',
    emergencyContact ? emergencyContact.trim() : '',
    emergencyPhone ? emergencyPhone.trim() : '',
    insuranceProvider ? insuranceProvider.trim() : '',
    allergies ? allergies.trim() : '',
    medicalHistory ? medicalHistory.trim() : '',
    notes ? notes.trim() : '',
    id
  ]);

  if (result.affectedRows === 0) {
    return null;
  }

  return getPatientById(id);
};

const deletePatient = async (id) => {
  const [result] = await db.query(
    'DELETE FROM patient WHERE patient_id = ?',
    [id]
  );

  return result.affectedRows > 0;
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};
