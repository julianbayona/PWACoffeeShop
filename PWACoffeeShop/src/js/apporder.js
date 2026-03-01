
import { coffees } from './app.js';

// Obtenemos el nombre del café de la URL
const urlParams = new URLSearchParams(window.location.search);
const coffeeName = urlParams.get('coffee') || "Café Especial";

// =========================================================
// Promesa: Renderizar el título y las opciones de precio
// según el café elegido en el query param
// =========================================================
const renderizarOpciones = (nombreCafe) => {
  return new Promise((resolve, reject) => {
    const cafe = coffees.find(c => c.name.trim() === nombreCafe.trim());

    if (!cafe) {
      reject(`No se encontró información para el café: "${nombreCafe}"`);
      return;
    }

    // Actualizamos el título con el nombre del café
    const titulo = document.getElementById('coffee-title');
    if (titulo) titulo.textContent = `Personaliza tu ${cafe.name.trim()}`;

    // Actualizamos las opciones del select con los precios correspondientes
    const sizeSelect = document.getElementById('size');
    if (sizeSelect) {
      sizeSelect.innerHTML = `
        <option value="Pequeño">Pequeño (8 oz)  —  ${cafe.price.small}</option>
        <option value="Mediano" selected>Mediano (12 oz) —  ${cafe.price.medium}</option>
        <option value="Grande">Grande (16 oz) —  ${cafe.price.large}</option>
      `;
    }

    resolve(cafe);
  });
};

const guardarEnArray = (nuevaOrden) => {
    return new Promise((resolve) => {
        // 1. Traemos el arreglo actual (o creamos uno vacío)
        let misOrdenes = JSON.parse(localStorage.getItem('misOrdenesArray')) || [];

        // 2. Insertamos la nueva orden en el arreglo
        misOrdenes.push(nuevaOrden);

        // 3. Lo guardamos para que index.html pueda leerlo
        localStorage.setItem('misOrdenesArray', JSON.stringify(misOrdenes));

        console.log("Arreglo actualizado:", misOrdenes);
        resolve("Orden guardada exitosamente.");
    });
};

// =========================================================
// Al cargar el DOM: renderizamos las opciones del café elegido
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  renderizarOpciones(coffeeName)
    .then((cafe) => {
      console.log(`Opciones renderizadas para: ${cafe.name.trim()}`);
    })
    .catch((error) => {
      console.error(error);
      const titulo = document.getElementById('coffee-title');
      if (titulo) titulo.textContent = coffeeName;
    });
});

// =========================================================
// Capturar el envío del formulario de la orden
// =========================================================
const orderForm = document.getElementById('order-form');

if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Extraemos los datos del formulario
        const size = document.getElementById('size').value;
        const hasSugar = document.getElementById('sugar').checked;

        // Construimos el objeto de la orden
        const nuevaOrden = {
            id: Date.now(),
            cafe: coffeeName,
            tamaño: size,
            azucar: hasSugar,
            fecha: new Date().toLocaleString()
        };

        const resultDiv = document.getElementById('order-result');
        const btnSubmit = document.querySelector('.btn-submit');

        resultDiv.textContent = "Procesando tu orden...";
        resultDiv.className = 'success';
        resultDiv.style.display = 'block';
        btnSubmit.disabled = true;

        // Ejecutamos nuestra Promesa
        guardarEnArray(nuevaOrden)
            .then((mensaje) => {
                // Mostramos mensaje de éxito
                resultDiv.textContent = `¡Listo! ${mensaje}`;

                // IMPORTANTE: Para ver el arreglo en consola, 
                // vamos a comentar temporalmente la redirección.
                /*
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
                */

                // Reactivamos el botón por si quieres hacer otra orden
                setTimeout(() => {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = "Hacer otro pedido igual";
                }, 1000);
            })
            .catch((error) => {
                console.error(error);
            });
    });
}