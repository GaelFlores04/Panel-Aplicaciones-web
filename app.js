// =====================================================
// 1. ELEMENTOS DE LA PÁGINA
// =====================================================
const API = "https://dummyjson.com";

const vistaLogin = document.querySelector("#vista-login");
const vistaPanel = document.querySelector("#vista-panel");

const formLogin = document.querySelector("#form-login");
const inputUsuario = document.querySelector("#usuario");
const inputClave = document.querySelector("#clave");
const btnEntrar = document.querySelector("#btn-entrar");
const errorLogin = document.querySelector("#error-login");

const btnSalir = document.querySelector("#btn-salir");
const perfil = document.querySelector("#perfil");

const contadores = document.querySelector("#contadores");
const formAgregar = document.querySelector("#form-agregar");
const inputNuevaTarea = document.querySelector("#nueva-tarea");
const botonesFiltro = document.querySelectorAll(".filtro");
const buscador = document.querySelector("#buscador");
const errorTareas = document.querySelector("#error-tareas");
const lista = document.querySelector("#lista");

// =====================================================
// 2. ESTADO (lo que la página recuerda)
// =====================================================
let usuario = null;
let tareas = [];
let filtro = "todas"; // todas | pendientes | completadas
let busqueda = "";

// =====================================================
// 3. FUNCIONES AUXILIARES
// =====================================================
function mostrarVista(nombre) {
  vistaLogin.hidden = nombre !== "login";
  vistaPanel.hidden = nombre !== "panel";
}

function mostrarMensaje(elemento, texto) {
  elemento.textContent = texto;
  elemento.hidden = texto === "";
}

// fetch NO falla con un 401 o 404, por eso revisamos res.ok nosotros.
async function pedir(url, opciones) {
  const res = await fetch(url, opciones);
  if (!res.ok) {
    const error = new Error(`El servidor respondio ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return await res.json();
}

// Para las peticiones que mandan JSON (POST y PUT)
function conJSON(metodo, datos) {
  return {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  };
}

// =====================================================
// 4. SESIÓN
// =====================================================
async function iniciarSesion(event) {
  event.preventDefault();
  mostrarMensaje(errorLogin, "");
  btnEntrar.disabled = true;
  btnEntrar.textContent = "Entrando…";

  try {
    const datos = await pedir(
      `${API}/auth/login`,
      conJSON("POST", { username: inputUsuario.value, password: inputClave.value })
    );
    localStorage.setItem("accessToken", datos.accessToken);
    await cargarPanel();
  } catch (error) {
    if (error.status === 400) {
      mostrarMensaje(errorLogin, "Usuario o contraseña incorrectos");
    } else {
      mostrarMensaje(errorLogin, "No se pudo iniciar sesión");
    }
  } finally {
    btnEntrar.disabled = false;
    btnEntrar.textContent = "Entrar";
  }
}

function cerrarSesion(mensaje = "") {
  localStorage.removeItem("accessToken");
  usuario = null;
  tareas = [];
  mostrarMensaje(errorLogin, mensaje);
  mostrarVista("login");
}

// =====================================================
// 5. PERFIL
// =====================================================
function pintarPerfil() {
  const { image, firstName, lastName, email, phone, address } = usuario;
  const ciudad = address?.city ?? "Sin registrar";

  perfil.innerHTML = `
    <div class="perfil">
      <img src="${image}" alt="Foto de ${firstName}">
      <div>
        <h2>${firstName} ${lastName}</h2>
        <p>Correo: ${email}</p>
        <p>Teléfono: ${phone}</p>
        <p>Ciudad: ${ciudad}</p>
      </div>
    </div>`;
}

// Se usa al iniciar sesión y cada vez que se recarga la página
async function cargarPanel() {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    mostrarVista("login");
    return;
  }

  try {
    usuario = await pedir(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    pintarPerfil();
    mostrarVista("panel");
  } catch (error) {
    if (error.status === 401) {
      cerrarSesion("Tu sesión expiró, entra de nuevo");
    } else {
      cerrarSesion("No se pudo cargar tu perfil");
    }
  }
}

// =====================================================
// 8. EVENTOS
// =====================================================
formLogin.addEventListener("submit", iniciarSesion);
btnSalir.addEventListener("click", () => cerrarSesion());

// =====================================================
// 9. INICIO
// =====================================================
cargarPanel();