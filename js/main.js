// =====================================================
// CABAÑAS LOS CAQUIS - COMPORTAMIENTO (JavaScript)
// =====================================================

// =====================================================
// CONFIGURACIÓN: lo que más vas a editar está acá arriba
// =====================================================

// "const" crea una variable que no cambia. Lo que va entre comillas es texto.

// Número de WhatsApp con código de país, sin "+" ni espacios (54 = Argentina, 9 = celular)
const NUMERO_WHATSAPP = "5491162677030";

// Link de Google Maps del complejo (se usa en "Acá estamos", "Cómo llegar" y en las reseñas)
const URL_MAPS = "https://www.google.com/maps/place/Caba%C3%B1a+Los+Caquis/@-34.3289069,-58.626241,17z/data=!3m1!4b1!4m9!3m8!1s0x95bca71a6ab85de5:0x93332d653051fb1!5m2!4m1!1i2!8m2!3d-34.3289069!4d-58.6236661!16s%2Fg%2F11g22_9d7m?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D";

// Las cabañas. Cada una es un "objeto" { ... } dentro de una lista [ ... ].
// - nombre: título de la cabaña
// - fotos:  lista de fotos (la primera es la portada de la tarjeta). Por ahora hay una por cabaña:
//           para sumar más, agregá "img/cabana1-2.jpg", "img/cabana1-3.jpg"... separadas por coma.
// - texto:  descripción que aparece abajo de las fotos (vacío por ahora: se completa al final)
const CABANAS = [
  {
    nombre: "Cabaña 1",
    fotos: ["img/cabana1-1.jpg"],
    texto: "",
  },
  {
    nombre: "Cabaña 2",
    fotos: ["img/cabana2-1.jpg"],
    texto: "",
  },
  {
    nombre: "Cabaña 3",
    fotos: ["img/cabana3-1.jpg"],
    texto: "",
  },
  {
    nombre: "Cabaña 4",
    fotos: ["img/cabana4-1.jpg"],
    texto: "",
  },
];

// Resumen de Google Maps. Dejalo en null hasta tener los datos reales (no inventamos números).
// Ejemplo cuando lo tengas: { puntaje: 4.8, cantidad: 25 }
const RESUMEN_RESENAS = null;

// Reseñas reales de Google Maps. Copiá acá las que quieras mostrar, tal cual las escribió cada persona.
// Ejemplo del formato (borrá este ejemplo cuando cargues las reales):
// { autor: "Nombre", estrellas: 5, texto: "Texto de la reseña" },
const RESENAS = [];

// =====================================================
// 1) LINKS DE MAPS: todos los <a data-maps> apuntan a URL_MAPS
// =====================================================
document.querySelectorAll("[data-maps]").forEach((enlace) => {
  enlace.href = URL_MAPS; // así el link se cambia en un solo lugar
});

// =====================================================
// 2) TARJETAS DE CABAÑAS: se arman solas desde la lista CABANAS
// =====================================================
const contenedorTarjetas = document.getElementById("tarjetas");

// forEach recorre la lista: por cada cabaña (y su posición "i") ejecuta el código de adentro
CABANAS.forEach((cabana, i) => {
  const tarjeta = document.createElement("article"); // crea un <article> en memoria
  tarjeta.className = "tarjeta aparecer";            // le pone sus clases CSS

  const foto = document.createElement("div");
  foto.className = "foto tarjeta__foto";
  foto.dataset.nombre = cabana.fotos[0] || "";       // cartel mientras no hay imagen

  const img = document.createElement("img");
  img.src = cabana.fotos[0];                         // la portada es la primera foto
  img.alt = cabana.nombre;
  img.loading = "lazy";
  img.addEventListener("error", () => img.remove()); // si la foto no existe, la saca y queda el recuadro verde
  foto.appendChild(img);                             // mete la imagen dentro del div

  const boton = document.createElement("button");
  boton.className = "tarjeta__boton";
  boton.dataset.indice = i;                          // guarda qué cabaña es, para abrir la correcta
  boton.innerHTML = `<strong></strong><span>Ver más</span>`;
  boton.querySelector("strong").textContent = cabana.nombre; // textContent es seguro: no interpreta HTML

  tarjeta.append(foto, boton);                       // arma la tarjeta
  contenedorTarjetas.appendChild(tarjeta);           // la agrega a la página
});

// =====================================================
// 3) CABECERA: se oscurece al bajar
// =====================================================
const cabecera = document.getElementById("cabecera");

function actualizarCabecera() {
  // classList.toggle(clase, condición): agrega la clase si la condición es verdadera y la quita si es falsa
  cabecera.classList.toggle("con-fondo", window.scrollY > 40); // scrollY = cuántos píxeles bajó la página
}
window.addEventListener("scroll", actualizarCabecera, { passive: true }); // "passive" = no frenamos el scroll (más fluido)
actualizarCabecera(); // la corremos una vez al cargar

// =====================================================
// 4) MENÚ DE CELULAR (hamburguesa)
// =====================================================
const botonMenu = document.getElementById("botonMenu");
const menu = document.getElementById("menu");

botonMenu.addEventListener("click", () => {
  // "() => {}" es una función flecha: el código que se ejecuta al hacer clic
  const abierto = menu.classList.toggle("abierto"); // alterna la clase y devuelve true/false
  botonMenu.setAttribute("aria-expanded", abierto); // avisa a lectores de pantalla
});

menu.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", () => {          // al tocar un enlace, cerramos el menú
    menu.classList.remove("abierto");
    botonMenu.setAttribute("aria-expanded", "false");
  });
});

// =====================================================
// 5) RESEÑAS: se dibujan desde RESENAS y RESUMEN_RESENAS
// =====================================================
const listaResenas = document.getElementById("resenasLista");
const avisoVacio = document.getElementById("resenasVacio");
const resumen = document.getElementById("resenasResumen");

// Convierte 4 en "★★★★☆"
function estrellas(n) {
  return "★".repeat(n) + "☆".repeat(5 - n); // repeat(n) repite el texto n veces
}

if (RESUMEN_RESENAS) {
  resumen.hidden = false; // muestra el resumen (el atributo hidden lo oculta)
  document.getElementById("resenasPuntaje").textContent = RESUMEN_RESENAS.puntaje.toString().replace(".", ","); // 4.8 → 4,8
  document.getElementById("resenasEstrellas").textContent = estrellas(Math.round(RESUMEN_RESENAS.puntaje));
  document.getElementById("resenasCantidad").textContent = `${RESUMEN_RESENAS.cantidad} reseñas en Google`;
}

RESENAS.forEach((r) => {
  const li = document.createElement("li");
  li.className = "resena";
  li.innerHTML = `<p class="resena__estrellas" aria-label=""></p><p class="resena__texto"></p><p class="resena__autor"></p>`;
  li.querySelector(".resena__estrellas").textContent = estrellas(r.estrellas);
  li.querySelector(".resena__estrellas").setAttribute("aria-label", `${r.estrellas} de 5 estrellas`);
  li.querySelector(".resena__texto").textContent = r.texto;
  li.querySelector(".resena__autor").textContent = r.autor;
  listaResenas.appendChild(li);
});
avisoVacio.hidden = RESENAS.length > 0; // si hay reseñas, se oculta el aviso "pronto..."

// =====================================================
// 6) ANIMACIÓN AL SCROLLEAR
// =====================================================
// Esto va DESPUÉS de crear las tarjetas, así también las anima
const elementos = document.querySelectorAll(".aparecer");

// Numeramos cada comodidad (0,1,2,3...) así aparecen una tras otra
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
          observador.unobserve(entrada.target);       // anima una sola vez
        }
      });
    },
    { threshold: 0.15 } // se activa cuando se ve el 15% del elemento
  );
  elementos.forEach((el) => observador.observe(el));
} else {
  elementos.forEach((el) => el.classList.add("visible")); // navegadores muy viejos: sin animación
}

// =====================================================
// 7) VENTANA DE CABAÑA CON GALERÍA DE FOTOS
// =====================================================
const modal = document.getElementById("modal");
const modalTitulo = document.getElementById("modalTitulo");
const modalTexto = document.getElementById("modalTexto");
const pista = document.getElementById("galeriaPista");       // fila horizontal de fotos
const contador = document.getElementById("galeriaContador"); // "2 / 5"

// Abre la ventana con los datos de la cabaña número "i"
function abrirCabana(i) {
  const cabana = CABANAS[i];
  modalTitulo.textContent = cabana.nombre;
  modalTexto.textContent = cabana.texto; // si está vacío, el CSS oculta el párrafo

  pista.replaceChildren(); // vacía las fotos de la cabaña anterior
  cabana.fotos.forEach((ruta, n) => {
    const slide = document.createElement("div");
    slide.className = "foto galeria__foto";
    slide.dataset.nombre = ruta;
    const img = document.createElement("img");
    img.src = ruta;
    img.alt = `${cabana.nombre}, foto ${n + 1}`;
    img.loading = "lazy";
    img.addEventListener("error", () => img.remove());
    slide.appendChild(img);
    pista.appendChild(slide);
  });

  // Con una sola foto no hacen falta flechas ni contador (hidden = oculto)
  const variasFotos = cabana.fotos.length > 1;
  document.getElementById("galeriaPrev").hidden = !variasFotos;
  document.getElementById("galeriaNext").hidden = !variasFotos;
  contador.hidden = !variasFotos;

  pista.scrollLeft = 0;      // arranca en la primera foto
  actualizarContador();
  modal.showModal();         // abre la ventana (método nativo de <dialog>)
}

// Escribe "foto actual / total"
function actualizarContador() {
  const total = pista.children.length;
  // scrollLeft / ancho = cuántas fotos nos movimos; Math.round redondea al entero más cercano
  const actual = Math.round(pista.scrollLeft / pista.clientWidth) + 1;
  contador.textContent = `${Math.min(actual, total)} / ${total}`;
}
pista.addEventListener("scroll", actualizarContador, { passive: true });

// Flechas: mueven la pista un "ancho" a la izquierda o a la derecha
document.getElementById("galeriaPrev").addEventListener("click", () => {
  pista.scrollBy({ left: -pista.clientWidth, behavior: "smooth" });
});
document.getElementById("galeriaNext").addEventListener("click", () => {
  pista.scrollBy({ left: pista.clientWidth, behavior: "smooth" });
});

// Un solo "escuchador" en el contenedor atiende los clics de las 4 tarjetas (se llama delegación de eventos)
contenedorTarjetas.addEventListener("click", (e) => {
  const boton = e.target.closest(".tarjeta__boton"); // busca el botón sobre el que se hizo clic
  if (boton) abrirCabana(Number(boton.dataset.indice)); // Number convierte el texto "2" en el número 2
});

document.getElementById("cerrarModal").addEventListener("click", () => modal.close());
document.getElementById("modalReservar").addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.close(); // clic en el fondo oscuro = cerrar
});

// =====================================================
// 8) FORMULARIO → WHATSAPP
// =====================================================
const formulario = document.getElementById("formulario");
const estado = document.getElementById("estado");

formulario.addEventListener("submit", (e) => {
  e.preventDefault(); // frena el envío normal (que recargaría la página)

  // .trim() saca espacios sobrantes al principio y al final
  const nombre = formulario.nombre.value.trim();
  const apellido = formulario.apellido.value.trim();
  const mensaje = formulario.mensaje.value.trim();

  if (!nombre || !apellido || !mensaje) {            // "!" = "no"; "||" = "o"
    estado.textContent = "Completá todos los campos.";
    estado.classList.add("error");
    return;                                          // corta la función acá
  }

  // Los ` ` (acento grave) permiten insertar variables con ${ }
  const texto = `Hola, soy ${nombre} ${apellido}. ${mensaje}`;
  // encodeURIComponent convierte espacios y tildes a un formato válido para una dirección web
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;

  window.open(url, "_blank", "noopener"); // abre WhatsApp en una pestaña nueva
  estado.textContent = "Abriendo WhatsApp…";
  estado.classList.remove("error");
  formulario.reset();                      // vacía el formulario
});
