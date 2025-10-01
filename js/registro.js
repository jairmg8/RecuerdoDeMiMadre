document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();
  window.location.href = "htm.html";
});

document.getElementById("registroForm").addEventListener("submit", function (event) {
  event.preventDefault();
  var modal = bootstrap.Modal.getInstance(document.getElementById('registroModal'));
  modal.hide();
  var alerta = document.getElementById("alertaRegistro");
  alerta.classList.remove("d-none");
  setTimeout(() => {
    alerta.classList.add("d-none");
  }, 4000);
});
document.getElementById("linkRegistro").addEventListener("click", function (event) {
  event.preventDefault();
  var loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
  if (loginModal) loginModal.hide();

  var registroModal = new bootstrap.Modal(document.getElementById('registroModal'));
  registroModal.show();
});

function inicarsesion() {
  const botonopen = document.getElementById("open-logen");
  const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));

  botonopen.addEventListener("click", function() {
    modal.style.display = "block";
    loginModal.show();
  });
}

