let patients = [];
let filteredPatients = [];
let currentPage = 1;
const pageSize = 4;

const tableBody = document.getElementById('patientsTableBody');
const patientsCounter = document.getElementById('patientsCounter');
const patientsPagination = document.getElementById('patientsPagination');
const patientSearch = document.getElementById('patientSearch');

function getInitials(fullName) {
  if (!fullName) return 'NP';
  const parts = fullName.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function patientRow(patient) {
  return `
    <div class="table-row">
      <div class="patient-info">
        <div class="avatar">${getInitials(patient.fullName)}</div>
        <div>
          <h4>${patient.fullName}</h4>
          <p>${patient.email || 'Sin correo registrado'}</p>
        </div>
      </div>
      <div class="cell">${patient.identification || ''}</div>
      <div class="cell">${patient.birthDateFormatted || ''}</div>
      <div class="actions">
        <button class="action-btn view" data-action="view" data-id="${patient.id}" title="Ver historial" aria-label="Ver historial">
          <i class='bx bx-show'></i>
        </button>
        <button class="action-btn edit" data-action="edit" data-id="${patient.id}" title="Editar paciente" aria-label="Editar paciente">
          <i class='bx bx-pencil'></i>
        </button>
        <button class="action-btn delete" data-action="delete" data-id="${patient.id}" title="Eliminar paciente" aria-label="Eliminar paciente">
          <i class='bx bx-trash'></i>
        </button>
      </div>
    </div>
  `;
}

function renderPagination(totalPages) {
  if (filteredPatients.length === 0) {
    patientsPagination.innerHTML = '';
    return;
  }

  let html = `
    <button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
      Anterior
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page ${i === currentPage ? 'active' : ''}" data-page="${i}">
        ${i}
      </button>
    `;
  }

  html += `
    <button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
      Siguiente
    </button>
  `;

  patientsPagination.innerHTML = html;
}

function renderPatients() {
  const searchTerm = patientSearch?.value.trim().toLowerCase() || '';

  filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm) ||
    String(patient.identification || '').toLowerCase().includes(searchTerm) ||
    String(patient.email || '').toLowerCase().includes(searchTerm)
  );

  const totalPatients = filteredPatients.length;
  const totalPages = Math.max(1, Math.ceil(totalPatients / pageSize));

  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const currentPatients = filteredPatients.slice(start, end);

  if (!tableBody) return;

  if (currentPatients.length === 0) {
    tableBody.innerHTML = `
      <div class="empty-state">
        <h3>No hay pacientes registrados</h3>
        <p>Cuando registres un paciente, aparecerá aquí automáticamente.</p>
      </div>
    `;
  } else {
    tableBody.innerHTML = currentPatients.map(patientRow).join('');
  }

  if (patientsCounter) {
    patientsCounter.textContent = `Mostrando ${currentPatients.length} de ${filteredPatients.length} pacientes`;
  }

  renderPagination(totalPages);
}

async function loadPatients() {
  try {
    const response = await fetch('/api/patients');
    patients = await response.json();
    renderPatients();
  } catch (error) {
    console.error(error);
  }
}

patientSearch?.addEventListener('input', function () {
  currentPage = 1;
  renderPatients();
});

tableBody?.addEventListener('click', async function (e) {
  const button = e.target.closest('button');
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === 'view') {
    window.location.href = `/detalle-paciente?id=${id}`;
  }

  if (action === 'edit') {
    window.location.href = `/nuevo-paciente?id=${id}`;
  }

  if (action === 'delete') {
    const confirmDelete = confirm('¿Deseas eliminar este paciente?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar el paciente');
      }

      await loadPatients();
    } catch (error) {
      alert('Error al eliminar el paciente');
      console.error(error);
    }
  }
});

patientsPagination?.addEventListener('click', function (e) {
  const button = e.target.closest('button');
  if (!button || button.disabled) return;

  currentPage = Number(button.dataset.page);
  renderPatients();
});

loadPatients();
