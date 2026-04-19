const params = new URLSearchParams(window.location.search);
const patientId = params.get('id');

function setText(id, value, fallback = 'No registrado') {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value && String(value).trim() !== '' ? value : fallback;
  }
}

function getInitials(fullName) {
  if (!fullName) return 'NP';
  const parts = fullName.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

async function loadPatient() {
  try {
    const response = await fetch(`/api/patients/${patientId}`);

    if (!response.ok) {
      throw new Error('Patient not found');
    }

    const patient = await response.json();

    setText('patientName', patient.fullName);
    setText('patientId', patient.identification);
    setText('patientLastVisit', patient.lastVisit || 'Today', 'Today');

    setText('infoNombres', patient.firstName);
    setText('infoApellidos', patient.lastName);
    setText('infoIdentificacion', patient.identification);
    setText('infoFechaNacimiento', patient.birthDateFormatted, 'No registrada');
    setText('infoGenero', patient.gender);
    setText('infoSangre', patient.bloodType);
    setText('infoTelefono', patient.phone);
    setText('infoCorreo', patient.email);
    setText('infoDireccion', patient.address, 'No registrada');
    setText('infoEps', patient.insuranceProvider, 'No registrada');
    setText('infoContactoEmergencia', patient.emergencyContact);
    setText('infoTelefonoEmergencia', patient.emergencyPhone);
    setText('infoAlergias', patient.allergies, 'No registrado');
    setText('infoAntecedentes', patient.medicalHistory, 'No registrado');
    setText('infoObservaciones', patient.notes, 'No registrado');

    setText('summaryName', patient.fullName);
    setText('summaryId', patient.identification);
    setText('summaryBirth', patient.birthDateFormatted, 'No registrada');
    setText('summaryGender', patient.gender);
    setText('summaryBlood', patient.bloodType);
    setText('summaryEmail', patient.email);

    const avatar = document.getElementById('patientAvatar');
    if (avatar) {
      avatar.textContent = getInitials(patient.fullName);
    }

    const editLink = document.getElementById('editPatientLink');
    if (editLink) {
      editLink.href = `/nuevo-paciente?id=${patient.id}`;
    }
  } catch (error) {
    console.error(error);
    alert('No se encontró el paciente');
    window.location.href = '/pacientes';
  }
}

loadPatient();
