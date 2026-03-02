// =========================================================
// orders.js — Página de listado de órdenes
// Script regular (no módulo) para evitar problemas de scope
// =========================================================

const ordersContainer = document.getElementById('orders-container');
const btnClear        = document.getElementById('btn-clear');

// =========================================================
// Renderizar las órdenes del localStorage
// =========================================================
function renderOrdenes() {
  const misOrdenes = JSON.parse(localStorage.getItem('misOrdenesArray')) || [];

  if (misOrdenes.length === 0) {
    ordersContainer.innerHTML = `
      <div class="orders-empty">
        <span>☕</span>
        <p>No tienes órdenes registradas aún.</p>
        <a href="index.html">Ver el menú</a>
      </div>
    `;
    return;
  }

  const total = misOrdenes.length;
  let html = `<p class="orders-total">${total} orden${total !== 1 ? 'es' : ''} registrada${total !== 1 ? 's' : ''}</p>`;

  misOrdenes.forEach((orden, index) => {
    html += `
      <div class="order-card">
        <span class="order-card-title">#${index + 1} — ${orden.cafe}</span>
        <span class="order-card-detail">
           Tamaño: <strong>${orden.tamaño}</strong>
          &nbsp;|&nbsp;
           Azúcar: <strong>${orden.azucar ? 'Sí' : 'No'}</strong>
        </span>
        <span class="order-card-date"> ${orden.fecha}</span>
        <a class="btn-edit" href="edit-order.html?id=${orden.id}">&#9998; Editar</a>
      </div>
    `;
  });

  ordersContainer.innerHTML = html;
}

// =========================================================
// Limpiar todas las órdenes
// =========================================================
btnClear.addEventListener('click', () => {
  if (confirm('¿Seguro que quieres eliminar todas las órdenes?')) {
    localStorage.removeItem('misOrdenesArray');
    renderOrdenes();
  }
});

// =========================================================
// Inicializar
// =========================================================
renderOrdenes();
