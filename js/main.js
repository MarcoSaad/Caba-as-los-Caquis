// =====================================================
// CABAÑAS LOS CAQUIS - COMPORTAMIENTO (JavaScript)
// =====================================================

// ---- CONFIGURACIÓN: ÚNICO LUGAR QUE HAY QUE EDITAR ----
// Número de WhatsApp con código de país y sin "+" ni espacios. Ejemplo Argentina: "5491122334455"
const NUMERO_WHATSAPP = ""; // <-- completar con el número real

// "const" crea una variable que no cambia. Las comillas indican que es texto.

// ---- 1) CABECERA: se oscurece al bajar ----
const cabecera = document.getElementById("cabecera"); // busca en el HTML el elemento con id="cabecera"

function actualizarCabecera() {
  // classList.toggle(clase, condición): agrega la clase si la condición es verdadera y la quita si es falsa
  cabecera.classList.toggle("con-fondo", window.scrollY > 40); // scrollY = cuántos píxeles bajó la página
}
window.addEventListener("scroll", actualizarCabecera, { passive: true }); // "passive" = le avisa al navegador que no frenamos el scroll (más fluido)
actualizarCabecera(); // la corremos una vez al cargar, por si la página ya está scrolleada

// ---- 2) MENÚ DE CELULAR (hamburguesa) ----
const botonMenu = document.getElementById("botonMenu");
const menu = document.getElementById("menu");

botonMenu.addEventListener("click", () => {
  // "() => {}" es una función flecha: el código que se ejecuta al hacer clic
  const abierto = menu.classList.toggle("abierto"); // alterna la clase y devuelve true/false
  botonMenu.setAttribute("aria-expanded", abierto); // avisa a lectores de pantalla si está abierto
});

menu.querySelectorAll("a").forEach((enlace) => {
  // Por cada enlace del menú: al tocarlo, cerramos el menú
  enlace.addEventListener("click", () => {
    menu.classList.remove("abierto");
    botonMenu.setAttribute("aria-expanded", "false");
  });
});

// ---- 3) ANIMACIÓN AL SCROLLEAR ----
const elementos = document.querySelectorAll(".aparecer"); // todos los elementos marcados en el HTML

// Para las comodidades, numeramos cada <li> (0,1,2...) así aparecen uno tras otro
document.querySelectorAll(".comodidades li").forEach((li, i) => {
  li.style.setProperty("--n", i % 4); // el CSS usa --n para el retraso; i % 4 = posición dentro de la fila de 4
});

if ("IntersectionObserver" in window) {
  // IntersectionObserver avisa cuando un elemento entra en la pantalla (sin recalcular a cada scroll)
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {                 // true = ya se ve en pantalla
          entrada.target.classList.add("visible");    // el CSS hace la animación
          observador.unobserve(entrada.target);       // ya no hace falta vigilarlo: anima una sola vez
        }
      });
    },
    { threshold: 0.15 } // se activa cuando se ve el 15% del elemento
  );
  elementos.forEach((el) => observador.observe(el));
} else {
  // Navegadores muy viejos: mostramos todo sin animar
  elementos.forEach((el) => el.classList.add("visible"));
}

// ---- 4) VENTANA EMERGENTE DE CABAÑAS ----
const modal = document.getElementById("modal");
const modalTitulo = document.getElementById("modalTitulo");

document.querySelectorAll("[data-cabana]").forEach((boton) => {
  boton.addEventListener("click", () => {
    modalTitulo.textContent = boton.dataset.cabana; // dataset.cabana lee el atributo data-cabana del HTML
    modal.showModal();                               // abre la ventana (método nativo de <dialog>)
  });
});

document.getElementById("cerrarModal").addEventListener("click", () => modal.close());
document.getElementById("modalReservar").addEventListener("click", () => modal.close());
// Cerrar al hacer clic en el fondo oscuro (fuera de la ventana)
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close(); // e.target = dónde se hizo clic
});

// ---- 5) FORMULARIO → WHATSAPP ----
const formulario = document.getElementById("formulario");
const estado = document.getElementById("estado");

formulario.addEventListener("submit", (e) => {
  e.preventDefault(); // frena el envío normal del formulario (que recargaría la página)

  // .trim() saca espacios sobrantes al principio y al final
  const nombre = formulario.nombre.value.trim();
  const apellido = formulario.apellido.value.trim();
  const mensaje = formulario.mensaje.value.trim();

  if (!nombre || !apellido || !mensaje) {            // "!" = "no"; "||" = "o"
    estado.textContent = "Completá todos los campos.";
    estado.classList.add("error");
    return;                                          // corta la función acá
  }
  if (!NUMERO_WHATSAPP) {
    estado.textContent = "Falta configurar el número de WhatsApp (js/main.js).";
    estado.classList.add("error");
    return;
  }

  // Armamos el texto del mensaje. Los ` ` (acento grave) permiten insertar variables con ${ }
  const texto = `Hola, soy ${nombre} ${apellido}. ${mensaje}`;
  // encodeURIComponent convierte espacios y tildes a un formato válido para una dirección web
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;

  window.open(url, "_blank", "noopener"); // abre WhatsApp en una pestaña nueva
  estado.textContent = "Abriendo WhatsApp…";
  estado.classList.remove("error");
  formulario.reset();                      // vacía el formulario
});
