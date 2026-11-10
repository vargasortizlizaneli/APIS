"use strict";

const endpoints = Object.freeze({
  citas: "https://dummyjson.com/quotes/random",
  perros: "https://dog.ceo/api/breeds/image/random",
  gatos: "https://cataas.com/cat?json=true",
  datos: "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en"
});

// El límite evita que una conexión bloqueada deje un botón deshabilitado.
async function consultarJSON(url) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 20000);
  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controlador.signal
    });
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(temporizador);
  }
}

function validarTexto(valor) {
  if (typeof valor !== "string" || !valor.trim()) {
    throw new Error("La API no devolvió el contenido esperado.");
  }
  return valor;
}

// Se espera también la descarga de la imagen: un JSON válido no garantiza
// que la imagen exista. No se procesa una imagen con response.json().
function cargarImagen(imagen, url) {
  const direccion = new URL(validarTexto(url));
  if (direccion.protocol !== "https:") throw new Error("URL de imagen inválida.");
  return new Promise((resolve, reject) => {
    const temporizador = setTimeout(() => terminar(new Error("La imagen tardó demasiado.")), 20000);
    function terminar(error) {
      clearTimeout(temporizador);
      imagen.onload = null;
      imagen.onerror = null;
      if (error) {
        imagen.removeAttribute("src");
        reject(error);
      } else resolve();
    }
    imagen.onload = () => terminar();
    imagen.onerror = () => terminar(new Error("No se pudo cargar la imagen."));
    imagen.src = direccion.href;
  });
}

async function actualizarSeccion(id, consultar) {
  const tarjeta = document.getElementById(id);
  const boton = tarjeta.querySelector("button");
  if (boton.disabled) return;
  const estado = tarjeta.querySelector("[data-estado]");
  const contenido = tarjeta.querySelector("[data-contenido]");
  boton.disabled = true;
  tarjeta.setAttribute("aria-busy", "true");
  contenido.hidden = true;
  contenido.classList.add("d-none");
  estado.className = "small text-body-secondary";
  estado.textContent = "Cargando…";
  try {
    await consultar();
    contenido.hidden = false;
    contenido.classList.remove("d-none");
    estado.textContent = "Contenido actualizado.";
  } catch (error) {
    console.error(`No se pudo actualizar ${id}:`, error);
    estado.className = "alert alert-danger small";
    estado.textContent = "No se pudo cargar el contenido. Comprueba tu conexión y pulsa el botón para reintentar.";
  } finally {
    boton.disabled = false;
    tarjeta.setAttribute("aria-busy", "false");
  }
}

async function obtenerCita() {
  await actualizarSeccion("citas", async () => {
    const datos = await consultarJSON(endpoints.citas);
    const cita = validarTexto(datos.quote);
    const autor = validarTexto(datos.author);
    document.getElementById("texto-cita").textContent = cita;
    document.getElementById("autor-cita").textContent = autor;
  });
}

async function obtenerPerro() {
  await actualizarSeccion("perros", async () => {
    const datos = await consultarJSON(endpoints.perros);
    if (datos.status !== "success") throw new Error("Dog CEO no devolvió una imagen.");
    await cargarImagen(document.getElementById("imagen-perro"), datos.message);
  });
}

async function obtenerGato() {
  await actualizarSeccion("gatos", async () => {
    const datos = await consultarJSON(endpoints.gatos);
    // JSON inspeccionado: id, tags, created_at, url y mimetype.
    const id = validarTexto(datos.id ?? datos._id);
    await cargarImagen(document.getElementById("imagen-gato"), `https://cataas.com/cat/${encodeURIComponent(id)}`);
  });
}

async function obtenerDatoCurioso() {
  await actualizarSeccion("datos", async () => {
    const datos = await consultarJSON(endpoints.datos);
    document.getElementById("texto-dato").textContent = validarTexto(datos.text);
  });
}

const consultas = { citas: obtenerCita, perros: obtenerPerro, gatos: obtenerGato, datos: obtenerDatoCurioso };
for (const [id, consultar] of Object.entries(consultas)) {
  document.querySelector(`#${id} button`).addEventListener("click", consultar);
  // Se inician de forma independiente: una API lenta no bloquea las demás.
  consultar();
}
