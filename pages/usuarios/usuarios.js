// Datos de usuarios (simulación)
let users = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan@example.com",
    role: "Admin",
    status: "Activo",
  },
  {
    id: 2,
    name: "María García",
    email: "maria@example.com",
    role: "Editor",
    status: "Activo",
  },
  {
    id: 3,
    name: "Carlos López",
    email: "carlos@example.com",
    role: "Usuario",
    status: "Inactivo",
  },
  {
    id: 4,
    name: "Ana Martínez",
    email: "ana@example.com",
    role: "Editor",
    status: "Activo",
  },
];

let editingId = null;
let deleteId = null;

// Renderizar tabla
function renderUsers(filteredUsers = users) {
  const tbody = document.getElementById("userTableBody");
  const noResults = document.getElementById("noResults");

  if (filteredUsers.length === 0) {
    tbody.innerHTML = "";
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";
  tbody.innerHTML = filteredUsers
    .map(
      (user) => `
                <tr>
                    <td>${user.id}</td>
                    <td><i class="bi bi-person-circle"></i> ${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="badge bg-info">${user.role}</span></td>
                    <td>
                        <span class="badge ${
                          user.status === "Activo"
                            ? "bg-success"
                            : "bg-secondary"
                        } badge-status">
                            ${user.status}
                        </span>
                    </td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-warning btn-action" onclick="editUser(${
                          user.id
                        })" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-action" onclick="deleteUser(${
                          user.id
                        })" title="Eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `
    )
    .join("");
}

// Búsqueda
document.getElementById("searchInput").addEventListener("input", function (e) {
  const search = e.target.value.toLowerCase();
  const filtered = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search)
  );
  renderUsers(filtered);
});

// Abrir modal para agregar
function openAddModal() {
  editingId = null;
  document.getElementById("modalTitle").textContent = "Nuevo Usuario";
  document.getElementById("userForm").reset();
  document.getElementById("userId").value = "";
}

// Editar usuario
function editUser(id) {
  editingId = id;
  const user = users.find((u) => u.id === id);

  document.getElementById("modalTitle").textContent = "Editar Usuario";
  document.getElementById("userId").value = user.id;
  document.getElementById("userName").value = user.name;
  document.getElementById("userEmail").value = user.email;
  document.getElementById("userRole").value = user.role;
  document.getElementById("userStatus").value = user.status;

  new bootstrap.Modal(document.getElementById("userModal")).show();
}

// Guardar usuario
function saveUser() {
  const form = document.getElementById("userForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const userData = {
    name: document.getElementById("userName").value,
    email: document.getElementById("userEmail").value,
    role: document.getElementById("userRole").value,
    status: document.getElementById("userStatus").value,
  };

  if (editingId) {
    // Actualizar
    const index = users.findIndex((u) => u.id === editingId);
    users[index] = { ...users[index], ...userData };
  } else {
    // Crear nuevo
    const newId = Math.max(...users.map((u) => u.id), 0) + 1;
    users.push({ id: newId, ...userData });
  }

  renderUsers();
  bootstrap.Modal.getInstance(document.getElementById("userModal")).hide();
  form.reset();
}

// Eliminar usuario
function deleteUser(id) {
  deleteId = id;
  const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
  modal.show();
}

document.getElementById("confirmDelete").addEventListener("click", function () {
  users = users.filter((u) => u.id !== deleteId);
  renderUsers();
  bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
});

// Inicializar
renderUsers();
