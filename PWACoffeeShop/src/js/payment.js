// =========================================================
// payment.js — Confirmación de pago
// =========================================================

// Mapa de precios (espejo del array en app.js)
const PRECIOS = {
  'Latte':                   { Pequeño: 3.5,  Mediano: 4.0,  Grande: 4.5 },
  'Expresso':                { Pequeño: 2.5,  Mediano: 3.0,  Grande: 3.5 },
  'Capuchino':               { Pequeño: 3.0,  Mediano: 3.5,  Grande: 4.0 },
  'Mokachino':               { Pequeño: 4.0,  Mediano: 4.5,  Grande: 5.0 },
  'Chocolate':               { Pequeño: 2.5,  Mediano: 3.0,  Grande: 3.5 },
  'Cafe con leche':          { Pequeño: 3.0,  Mediano: 3.5,  Grande: 4.0 },
  'Capuchino con chocolate': { Pequeño: 3.5,  Mediano: 4.0,  Grande: 4.5 },
  'Tradicional':             { Pequeño: 2.5,  Mediano: 3.0,  Grande: 3.5 },
  'Capuchino Vienes':        { Pequeño: 3.0,  Mediano: 3.5,  Grande: 4.0 },
};

function getPrecio(cafe, tamaño) {
  const mapa = PRECIOS[cafe.trim()];
  if (!mapa) return 0;
  return mapa[tamaño] || 0;
}

// =========================================================
// Cargar órdenes y calcular total
// =========================================================
const misOrdenes = JSON.parse(localStorage.getItem('misOrdenesArray')) || [];

if (misOrdenes.length === 0) {
  window.location.href = 'orders.html';
}

let totalNum = 0;

const paymentItems = document.getElementById('payment-items');
const paymentTotal = document.getElementById('payment-total');
const cashAmount   = document.getElementById('cash-amount');

let itemsHtml = '';
misOrdenes.forEach((orden, index) => {
  const precio = getPrecio(orden.cafe, orden.tamaño);
  totalNum += precio;
  itemsHtml += `
    <div class="order-card" style="margin-bottom:0.6rem;">
      <span class="order-card-title">#${index + 1} — ${orden.cafe}</span>
      <span class="order-card-detail">
        ${orden.tamaño} &nbsp;|&nbsp; Azúcar: ${orden.azucar ? 'Sí' : 'No'}
        &nbsp;|&nbsp; <strong>$${precio.toFixed(2)}</strong>
      </span>
    </div>
  `;
});

paymentItems.innerHTML = itemsHtml;
paymentTotal.textContent = `$${totalNum.toFixed(2)}`;
cashAmount.textContent   = `$${totalNum.toFixed(2)}`;

// =========================================================
// Cambiar método de pago
// =========================================================
const tabs       = document.querySelectorAll('.method-tab');
const panelCash  = document.getElementById('panel-cash');
const panelCredit= document.getElementById('panel-credit');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    if (tab.dataset.method === 'cash') {
      panelCash.style.display   = 'block';
      panelCredit.style.display = 'none';
    } else {
      panelCash.style.display   = 'none';
      panelCredit.style.display = 'block';
    }
  });
});

// =========================================================
// Utilidad: mostrar mensaje de éxito y borrar órdenes
// =========================================================
function confirmarPago(metodo) {
  localStorage.removeItem('misOrdenesArray');

  document.getElementById('payment-view').style.display = 'none';
  document.getElementById('success-view').style.display = 'block';
  document.getElementById('success-method').textContent =
    `Método: ${metodo === 'cash' ? '💵 Efectivo' : '💳 Tarjeta de crédito'}`;
  document.getElementById('success-amount').textContent =
    `Monto cobrado: $${totalNum.toFixed(2)}`;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =========================================================
// Confirmar pago en efectivo
// =========================================================
document.getElementById('btn-confirm-cash').addEventListener('click', () => {
  confirmarPago('cash');
});

// =========================================================
// Validar y confirmar pago con crédito
// =========================================================
const creditForm = document.getElementById('credit-form');

// Formato automático del número de tarjeta (grupos de 4)
const cardNumberInput = document.getElementById('card-number');
cardNumberInput.addEventListener('input', () => {
  let val = cardNumberInput.value.replace(/\D/g, '').substring(0, 16);
  cardNumberInput.value = val.replace(/(.{4})/g, '$1 ').trim();
});

// Formato automático de vencimiento MM/AA
const cardExpiryInput = document.getElementById('card-expiry');
cardExpiryInput.addEventListener('input', () => {
  let val = cardExpiryInput.value.replace(/\D/g, '').substring(0, 4);
  if (val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2);
  cardExpiryInput.value = val;
});

// Solo números en CVV
const cardCvvInput = document.getElementById('card-cvv');
cardCvvInput.addEventListener('input', () => {
  cardCvvInput.value = cardCvvInput.value.replace(/\D/g, '').substring(0, 4);
});

function setError(id, msg) {
  document.getElementById(id).textContent = msg;
}
function clearErrors() {
  ['err-name', 'err-number', 'err-expiry', 'err-cvv'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
}

creditForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const name   = document.getElementById('card-name').value.trim();
  const number = document.getElementById('card-number').value.replace(/\s/g, '');
  const expiry = document.getElementById('card-expiry').value.trim();
  const cvv    = document.getElementById('card-cvv').value.trim();

  let valid = true;

  if (!name) {
    setError('err-name', 'Ingresa el nombre del titular.');
    valid = false;
  }
  if (!/^\d{16}$/.test(number)) {
    setError('err-number', 'El número debe tener 16 dígitos.');
    valid = false;
  }
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
    setError('err-expiry', 'Formato inválido. Usa MM/AA.');
    valid = false;
  }
  if (!/^\d{3,4}$/.test(cvv)) {
    setError('err-cvv', 'CVV inválido (3 o 4 dígitos).');
    valid = false;
  }

  if (!valid) return;

  const btn = creditForm.querySelector('.btn-submit');
  btn.disabled = true;
  btn.textContent = 'Procesando...';

  // Simulamos un segundo de procesamiento
  setTimeout(() => {
    confirmarPago('credit');
  }, 1200);
});
