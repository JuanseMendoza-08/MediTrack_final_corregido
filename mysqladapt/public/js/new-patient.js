function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

const patientForm = document.getElementById('patientForm');
const params = new URLSearchParams(window.location.search);
const patientId = params.get('id');

const formTitle = document.getElementById('formTitle');
const formSubtitle = document.getElementById('formSubtitle');
const submitButton = document.getElementById('submitButton');

function fillForm(patient) {
  const setValue = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.value = value || '';
  };

  setValue('nombres', patient.firstName);
  setValue('apellidos', patient.lastName);
  setValue('identificacion', patient.identification);
  setValue('fechaNacimiento', patient.birthDate);
  setValue('genero', patient.gender);
  setValue('sangre', patient.bloodType);
  setValue('telefono', patient.phone);
  setValue('correo', patient.email);
  setValue('direccion', patient.address);
  setValue('contactoEmergencia', patient.emergencyContact);
  setValue('telefonoEmergencia', patient.emergencyPhone);
  setValue('eps', patient.insuranceProvider);
  setValue('alergias', patient.allergies);
  setValue('antecedentes', patient.medicalHistory);
  setValue('observaciones', patient.notes);
}

async function loadPatientForEdit() {
  if (!patientId) return;

  try {
    const response = await fetch(`/api/patients/${patientId}`);

    if (!response.ok) {
      throw new Error('Patient not found');
    }

    const patient = await response.json();
    fillForm(patient);

    if (formTitle) formTitle.textContent = 'Editar Paciente';
    if (formSubtitle) formSubtitle.textContent = 'Actualiza la información del paciente';
    if (submitButton) submitButton.textContent = 'Actualizar Paciente';
  } catch (error) {
    console.error(error);
    alert('No se pudo cargar el paciente para editar');
    window.location.href = '/pacientes';
  }
}

if (patientForm) {
  patientForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
      firstName: document.getElementById('nombres')?.value.trim() || '',
      lastName: document.getElementById('apellidos')?.value.trim() || '',
      identification: document.getElementById('identificacion')?.value.trim() || '',
      birthDate: document.getElementById('fechaNacimiento')?.value || '',
      birthDateFormatted: formatDate(document.getElementById('fechaNacimiento')?.value || ''),
      gender: document.getElementById('genero')?.value || '',
      bloodType: document.getElementById('sangre')?.value || '',
      phone: document.getElementById('telefono')?.value.trim() || '',
      email: document.getElementById('correo')?.value.trim() || '',
      address: document.getElementById('direccion')?.value.trim() || '',
      emergencyContact: document.getElementById('contactoEmergencia')?.value.trim() || '',
      emergencyPhone: document.getElementById('telefonoEmergencia')?.value.trim() || '',
      insuranceProvider: document.getElementById('eps')?.value.trim() || '',
      allergies: document.getElementById('alergias')?.value.trim() || '',
      medicalHistory: document.getElementById('antecedentes')?.value.trim() || '',
      notes: document.getElementById('observaciones')?.value.trim() || ''
    };

    try {
      const url = patientId ? `/api/patients/${patientId}` : '/api/patients';
      const method = patientId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Could not save patient');
      }

      window.location.href = `/detalle-paciente?id=${result.id}`;
    } catch (error) {
      alert(error.message || 'Error al guardar el paciente');
      console.error(error);
    }
  });
}

loadPatientForEdit();
