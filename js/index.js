async function loadComponent(id, path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
    console.log(`se cargan los componentes ${path}`)
  } catch (err) {
    console.error(`Error cargando ${path}:`, err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  //loadComponent("svg-symbols", "layout/component/SvgSymbols.html");
  //loadComponent("theme-toggle", "layout/component/ThemeToggle.html");
  loadComponent("header", "layout/component/Header.html");
  loadComponent("hero", "layout/component/HeroSection.html");
  loadComponent("features", "layout/component/FeatureBlock.html");
  loadComponent("footer", "layout/component/Footer.html");
});


