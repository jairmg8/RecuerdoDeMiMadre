// Sistema de navegación dinámica
const mainContent = document.getElementById("main-content");
const homeContent = document.getElementById("home-content");
let currentScript = null;
let currentStylesheet = null;

async function loadPage(page) {
  try {
    // Mostrar contenedor dinámico, ocultar home
    mainContent.style.display = "block";
    homeContent.style.display = "none";

    // Limpiar script anterior
    if (currentScript) {
      currentScript.remove();
      currentScript = null;
    }

    // Limpiar stylesheet anterior
    if (currentStylesheet) {
      currentStylesheet.remove();
      currentStylesheet = null;
    }

    // Cargar el HTML
    const response = await fetch(page);
    if (!response.ok) throw new Error("Página no encontrada");

    const html = await response.text();
    mainContent.innerHTML = html;

    // Extraer y cargar CSS si existe en el HTML
    const cssMatch = html.match(/<link[^>]*href=["']([^"']*\.css)["'][^>]*>/);
    if (cssMatch) {
      const cssPath = cssMatch[1];
      currentStylesheet = document.createElement("link");
      currentStylesheet.rel = "stylesheet";
      currentStylesheet.href = cssPath;
      document.head.appendChild(currentStylesheet);
    }

    // Extraer y ejecutar JS si existe en el HTML
    const scriptMatch = html.match(
      /<script[^>]*src=["']([^"']*\.js)["'][^>]*>/
    );
    if (scriptMatch) {
      const scriptPath = scriptMatch[1];
      currentScript = document.createElement("script");
      currentScript.src = scriptPath;
      currentScript.defer = true;
      document.body.appendChild(currentScript);
    }

    // Cerrar offcanvas en mobile
    const offcanvas = bootstrap.Offcanvas.getInstance(
      document.getElementById("offcanvas")
    );
    if (offcanvas) offcanvas.hide();
  } catch (error) {
    console.error("Error al cargar la página:", error);
    mainContent.innerHTML = `
            <div class="container mt-5">
              <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error al cargar la página</h4>
                <p>No se pudo cargar el contenido solicitado.</p>
              </div>
            </div>
          `;
  }
}

function goHome() {
  mainContent.style.display = "none";
  homeContent.style.display = "block";

  // Limpiar script y stylesheet
  if (currentScript) {
    currentScript.remove();
    currentScript = null;
  }
  if (currentStylesheet) {
    currentStylesheet.remove();
    currentStylesheet = null;
  }
}

// Interceptar clics en enlaces del navbar
document.addEventListener("click", (e) => {
  const link = e.target.closest("a.nav-link");
  if (link && link.getAttribute("href")?.includes(".html")) {
    e.preventDefault();
    const page = link.getAttribute("href");
    loadPage(page);
  } else if (link && link.getAttribute("href") === "#") {
    e.preventDefault();
    goHome();
  }
});

// Manejar el logo para volver al home
document.addEventListener("click", (e) => {
  if (e.target.closest(".navbar-brand")) {
    e.preventDefault();
    goHome();
  }
});
