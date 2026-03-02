const container = document.querySelector(".container");
export const coffees = [
  {
    name: "Latte",
    image: "images/coffee1.jpg",
    price: { small: "$3.5", medium: "$4.0", large: "$4.5" } // Precios para diferentes tamaños
  },
  {
    name: "Expresso",
    image: "images/coffee2.jpg",
    price: { small: "$2.5", medium: "$3.0", large: "$3.5" }
  },
  {
    name: "Capuchino",
    image: "images/coffee3.jpg",
    price: { small: "$3.0", medium: "$3.5", large: "$4.0" }
  },
  {
    name: "Mokachino",
    image: "images/coffee4.jpg",
    price: { small: "$4.0", medium: "$4.5", large: "$5.0" }
  },
  {
    name: "Chocolate",
    image: "images/coffee5.jpg",
    price: { small: "$2.5", medium: "$3.0", large: "$3.5" }
  },
  {
    name: " Cafe con leche",
    image: "images/coffee6.jpg",
    price: { small: "$3.0", medium: "$3.5", large: "$4.0" }
  },
  {
    name: "Capuchino con chocolate",
    image: "images/coffee7.jpg",
    price: { small: "$3.5", medium: "$4.0", large: "$4.5" }
  },
  {
    name: "Tradicional",
    image: "images/coffee8.jpg",
    price: { small: "$2.5", medium: "$3.0", large: "$3.5" }
  },
  {
    name: "Capuchino Vienes",
    image: "images/coffee9.jpg",
    price: { small: "$3.0", medium: "$3.5", large: "$4.0" }
  }
];

// =========================================================
// Promesa: Actualizar el contador de ordenes en la vista
// =========================================================
const actualizarContador = () => {
  return new Promise((resolve, reject) => {
    const misOrdenes = JSON.parse(localStorage.getItem('misOrdenesArray')) || [];
    const contadorElemento = document.getElementById('counter-value');
    if (contadorElemento) {
      contadorElemento.textContent = misOrdenes.length;
    }
    resolve(contadorElemento);
  });
};
// =========================================================
// Promesa: Simular la obtención de datos del arreglo de cafés y su información
// =========================================================
const obtenerDatos = () => {
  return new Promise((resolve, reject) => {
    // Simulamos un retraso de red de 1 segundo
    setTimeout(() => {
      if (coffees.length > 0) {
        resolve(coffees);
      } else {
        reject("Error: No hay cafés disponibles en la base de datos.");
      }
    }, 1000);
  });
};

// =========================================================
// Promesa: Renderizar los componentes en el DOM
// =========================================================
const renderizarCafes = (datosCafe) => {
  return new Promise((resolve) => {
    let output = "";
    datosCafe.forEach(({ name, image, price }) => {
      output += `
        <div class="card">
          <img class="card--avatar" src="${image}" alt="${name}" />
          <h1 class="card--title">${name}</h1>
          <a class="card--link" href="order.html?coffee=${name}">Taste</a>
        </div>
      `;
    });
    container.innerHTML = output;
    resolve("Los componentes HTML han sido inyectados en el contenedor.");
  });
};

// =========================================================
// Promesa: Esperar a que las imágenes carguen visualmente
// =========================================================
const esperarImagenes = () => {
  return new Promise((resolve) => {
    const images = document.querySelectorAll('.card--avatar');
    let loadedCount = 0;
    if (images.length === 0) resolve("No hay imágenes para cargar.");
    images.forEach((img) => {
      if (img.complete) {
        loadedCount++;
        if (loadedCount === images.length) resolve("Todas las imágenes están listas.");
      } else {
        img.addEventListener('load', () => {
          loadedCount++;
          if (loadedCount === images.length) resolve("Todas las imágenes están listas.");
        });
        img.addEventListener('error', () => {
          loadedCount++;
          if (loadedCount === images.length) resolve("Las imágenes terminaron de procesarse (algunas con error).");
        });
      }
    });
  });
};

// =========================================================
// Promesa: Capturar la primera interacción del usuario
// =========================================================
const capturarPrimerClick = () => {
  return new Promise((resolve) => {
    const botones = document.querySelectorAll('.card--link');
    botones.forEach(btn => {
      btn.addEventListener('click', function manejadorClick(e) {
        e.preventDefault();
        const nombreCafe = e.target.previousElementSibling.textContent.trim();
        resolve(nombreCafe);
      });
    });
  });
};

// =========================================================
// Modal: Mostrar órdenes guardadas en localStorage
// =========================================================
const abrirModalOrdenes = () => {
  const modal = document.getElementById('orders-modal');
  const lista = document.getElementById('modal-orders-list');
  const misOrdenes = JSON.parse(localStorage.getItem('misOrdenesArray')) || [];

  if (misOrdenes.length === 0) {
    lista.innerHTML = '<p class="modal-empty">No tienes órdenes registradas aún.</p>';
  } else {
    lista.innerHTML = misOrdenes.map((orden, index) => `
      <div class="order-item">
        <span class="order-item-title">#${index + 1} — ${orden.cafe}</span>
        <span class="order-item-detail">Tamaño: ${orden.tamaño} &nbsp;|&nbsp; Azúcar: ${orden.azucar ? 'Sí' : 'No'}</span>
        <span class="order-item-date">📅 ${orden.fecha}</span>
      </div>
    `).join('');
  }

  modal.hidden = false;
  document.body.style.overflow = 'hidden';
};

const cerrarModalOrdenes = () => {
  const modal = document.getElementById('orders-modal');
  modal.hidden = true;
  document.body.style.overflow = '';
};

// Exponemos las funciones globalmente para que el onclick del HTML las encuentre
window.abrirModalOrdenes = abrirModalOrdenes;
window.cerrarModalOrdenes = cerrarModalOrdenes;

// =========================================================
//  Código exclusivo de index.html
//  (guard: container es null en order.html y otras páginas)
// =========================================================
if (container) {

  // Listeners del Modal
  const counterBtn = document.getElementById('order-counter-btn');
  const closeBtn   = document.getElementById('modal-close-btn');
  const clearBtn   = document.getElementById('btn-clear-orders');
  const overlay    = document.getElementById('orders-modal');

  if (counterBtn) counterBtn.addEventListener('click', abrirModalOrdenes);
  if (closeBtn)   closeBtn.addEventListener('click', cerrarModalOrdenes);
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('misOrdenesArray');
      actualizarContador();
      cerrarModalOrdenes();
    });
  }
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) cerrarModalOrdenes();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarModalOrdenes();
  });

  // Encadenamiento de las Promesas
  container.innerHTML = "<h2 style='text-align:center;'>Preparando tu café...</h2>";

  actualizarContador()
    .then((mensajeContador) => {
      console.log("1. Contador ordenes actualizado");
      return obtenerDatos();
    })
    .then((datos) => {
      console.log("2. Datos obtenidos con éxito.");
      return renderizarCafes(datos);
    })
    .then((mensajeRender) => {
      console.log(`2. ${mensajeRender}`);
      return esperarImagenes();
    })
    .then((mensajeImagenes) => {
      console.log(`3. ${mensajeImagenes}`);
      console.log("-> La interfaz está 100% lista para usarse.");
      return capturarPrimerClick();
    })
    .then((nombreCafe) => {
      console.log(`4. Usuario eligió: ${nombreCafe}. Redirigiendo...`);
      window.location.href = `order.html?coffee=${encodeURIComponent(nombreCafe)}`;
    })
    .catch((error) => {
      console.error(error);
      container.innerHTML = "<h2>Lo sentimos, ocurrió un error al cargar los cafés.</h2>";
    });

}

// =========================================================
// Registro del Service Worker
// =========================================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(res => console.log("Service worker registrado"))
      .catch(err => console.log("Service worker no registrado", err));
  });
}