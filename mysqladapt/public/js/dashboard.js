const activePatientsCount = document.getElementById('activePatientsCount');
const newTodayCount = document.getElementById('newTodayCount');
const withEmailCount = document.getElementById('withEmailCount');
const withAllergiesCount = document.getElementById('withAllergiesCount');
const recentPatientsList = document.getElementById('recentPatientsList');
const lastPatientBox = document.getElementById('lastPatientBox');

function getInitials(fullName) {
  if (!fullName) return 'NP';
  const parts = fullName.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function isToday(dateString) {
  if (!dateString) return false;
  const today = new Date();
  const date = new Date(dateString);
  return today.toDateString() === date.toDateString();
}

async function loadDashboard() {
  try {
    const response = await fetch('/api/patients');
    if (!response.ok) throw new Error('Could not load patients');
    const patients = await response.json();

    activePatientsCount.textContent = patients.length;
    newTodayCount.textContent = patients.filter(patient => isToday(patient.created_at)).length;
    withEmailCount.textContent = patients.filter(patient => patient.email && String(patient.email).trim() !== '').length;
    withAllergiesCount.textContent = patients.filter(patient => patient.allergies && String(patient.allergies).trim() !== '').length;

    if (patients.length === 0) {
      recentPatientsList.innerHTML = `
        <div class="dashboard-empty">
          <h3>No hay pacientes registrados</h3>
          <p>Los pacientes nuevos aparecerán aquí automáticamente.</p>
        </div>
      `;

      lastPatientBox.innerHTML = `
        <h3>No hay pacientes registrados</h3>
        <p>Registra un paciente y aquí verás un resumen rápido.</p>
      `;
      return;
    }

    recentPatientsList.innerHTML = patients.slice(0, 4).map(patient => `
      <div class="patient-row">
        <div class="patient-info">
          <div class="avatar">${getInitials(patient.fullName)}</div>
          <div>
            <h4>${patient.fullName}</h4>
            <p>ID: ${patient.identification || 'Sin ID'}</p>
          </div>
        </div>
        <div><span class="badge stable">Registered</span></div>
        <div class="action-icon">
          <a href="/detalle-paciente?id=${patient.id}" class="dashboard-view-link">
            <i class='bx bx-show'></i>
          </a>
        </div>
      </div>
    `).join('');

    const lastPatient = patients[0];
    lastPatientBox.innerHTML = `
      <div class="last-patient-top">
        <div class="last-patient-avatar">${getInitials(lastPatient.fullName)}</div>
        <div>
          <h3>${lastPatient.fullName}</h3>
          <p>${lastPatient.email || 'Sin correo registrado'}</p>
        </div>
      </div>
      <div class="last-patient-meta">
        <span><strong>ID:</strong> ${lastPatient.identification || 'Sin ID'}</span>
        <span><strong>Birth date:</strong> ${lastPatient.birthDateFormatted || 'No registrada'}</span>
      </div>
      <a href="/detalle-paciente?id=${lastPatient.id}" class="last-patient-button">Ver detalle</a>
    `;
  } catch (error) {
    console.error(error);
    activePatientsCount.textContent = '0';
    newTodayCount.textContent = '0';
    withEmailCount.textContent = '0';
    withAllergiesCount.textContent = '0';
    recentPatientsList.innerHTML = `
      <div class="dashboard-empty">
        <h3>Error al cargar pacientes</h3>
        <p>Revisa la conexión con el backend y MySQL.</p>
      </div>
    `;
    lastPatientBox.innerHTML = `
      <h3>Error de conexión</h3>
      <p>No se pudo cargar la información desde el servidor.</p>
    `;
  }
}

loadDashboard();
