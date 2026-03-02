// =========================================================
// edit-order.js — Edición de una orden existente
// =========================================================

const params   = new URLSearchParams(window.location.search);
const ordenId  = parseInt(params.get('id'), 10);

const misOrdenes = JSON.parse(localStorage.getItem('misOrdenesArray')) || [];
const ordenIndex = misOrdenes.findIndex(o => o.id === ordenId);

const titleEl    = document.getElementById('edit-title');
const subtitleEl = document.getElementById('edit-subtitle');
const sizeSelect = document.getElementById('size');
const sugarCheck = document.getElementById('sugar');
const editForm   = document.getElementById('edit-form');
const resultDiv  = document.getElementById('edit-result');

// =========================================================
// Si no existe la orden, mostramos error
// =========================================================
if (ordenIndex === -1) {
  titleEl.textContent = 'Orden no encontrada';
  subtitleEl.textContent = 'No pudimos encontrar la orden que buscas.';
  editForm.style.display = 'none';
} else {
  const orden = misOrdenes[ordenIndex];

  // -------------------------------------------------------
  // Poblamos el formulario con los datos actuales
  // -------------------------------------------------------
  titleEl.textContent       = `✏️ Editar — ${orden.cafe}`;
  subtitleEl.textContent    = `Orden #${ordenIndex + 1} · creada el ${orden.fecha}`;
  sizeSelect.value          = orden.tamaño;
  sugarCheck.checked        = orden.azucar;

  // -------------------------------------------------------
  // Guardar cambios
  // -------------------------------------------------------
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btnSubmit = editForm.querySelector('.btn-submit');

    // Actualizamos los campos editables
    misOrdenes[ordenIndex].tamaño = sizeSelect.value;
    misOrdenes[ordenIndex].azucar = sugarCheck.checked;
    misOrdenes[ordenIndex].fecha  = new Date().toLocaleString(); // actualizamos la fecha

    localStorage.setItem('misOrdenesArray', JSON.stringify(misOrdenes));

    // Feedback visual
    btnSubmit.disabled    = true;
    resultDiv.style.display = 'block';
    resultDiv.className   = 'success';
    resultDiv.textContent = '✅ ¡Cambios guardados correctamente!';

    // Redirigimos a la lista de órdenes luego de 1.5 s
    setTimeout(() => {
      window.location.href = 'orders.html';
    }, 1500);
  });
}
