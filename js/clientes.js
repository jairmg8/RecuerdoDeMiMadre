 document.addEventListener('DOMContentLoaded', function() {
            // Referencias DOM
            const clienteForm = document.getElementById('clienteForm');
            const formTitle = document.getElementById('form-title');
            const clienteId = document.getElementById('clienteId');
            const nombre = document.getElementById('nombre');
            const apellido = document.getElementById('apellido');
            const email = document.getElementById('email');
            const telefono = document.getElementById('telefono');
            const dni = document.getElementById('dni');
            const direccion = document.getElementById('direccion');
            const btnCancelar = document.getElementById('btnCancelar');
            const clientesTableBody = document.getElementById('clientesTableBody');
            const totalClientes = document.getElementById('totalClientes');
            const notification = document.getElementById('notification');
            const notificationIcon = document.getElementById('notificationIcon');
            const notificationMessage = document.getElementById('notificationMessage');
            
            // Variables globales
            let clientes = [];
            let editando = false;
            
            // Inicializar la aplicación
            init();
            
            function init() {
                // Cargar datos desde localStorage o usar datos de ejemplo
                const storedClientes = localStorage.getItem('clientes');
                if (storedClientes) {
                    clientes = JSON.parse(storedClientes);
                } else {
                    // Datos de ejemplo
                    clientes = [
                        {
                            id: 1,
                            nombre: 'Juan',
                            apellido: 'Pérez',
                            email: 'juan.perez@example.com',
                            telefono: '555-123-4567',
                            dni: '12345678A',
                            direccion: 'Calle Principal 123'
                        },
                        {
                            id: 2,
                            nombre: 'María',
                            apellido: 'González',
                            email: 'maria.gonzalez@example.com',
                            telefono: '555-987-6543',
                            dni: '87654321B',
                            direccion: 'Avenida Central 456'
                        },
                        {
                            id: 3,
                            nombre: 'Carlos',
                            apellido: 'Rodríguez',
                            email: 'carlos.rodriguez@example.com',
                            telefono: '555-567-8901',
                            dni: '45678912C',
                            direccion: 'Plaza Mayor 789'
                        }
                    ];
                    // Guardar en localStorage
                    saveClientes();
                }
                
                // Renderizar la tabla
                renderizarTabla();
                
                // Configurar event listeners
                clienteForm.addEventListener('submit', handleSubmit);
                btnCancelar.addEventListener('click', limpiarFormulario);
            }
            
            function renderizarTabla() {
                // Limpiar tabla
                clientesTableBody.innerHTML = '';
                
                // Actualizar contador
                totalClientes.textContent = clientes.length;
                
                // Si no hay clientes, mostrar mensaje
                if (clientes.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = '<td colspan="8" class="text-center py-4">No hay clientes registrados</td>';
                    clientesTableBody.appendChild(row);
                    return;
                }
                
                // Renderizar cada cliente
                clientes.forEach(cliente => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${cliente.id}</td>
                        <td>${cliente.nombre}</td>
                        <td>${cliente.apellido}</td>
                        <td>${cliente.email}</td>
                        <td>${cliente.telefono}</td>
                        <td>${cliente.dni}</td>
                        <td>${cliente.direccion || '-'}</td>
                        <td>
                            <button class="btn btn-sm btn-warning btn-action edit-btn" data-id="${cliente.id}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-action delete-btn" data-id="${cliente.id}" title="Eliminar">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    `;
                    
                    // Añadir el row a la tabla
                    clientesTableBody.appendChild(row);
                    
                    // Añadir event listeners para editar y eliminar
                    const editBtn = row.querySelector('.edit-btn');
                    const deleteBtn = row.querySelector('.delete-btn');
                    
                    editBtn.addEventListener('click', () => editarCliente(cliente.id));
                    deleteBtn.addEventListener('click', () => eliminarCliente(cliente.id));
                });
            }
            
            function handleSubmit(e) {
                e.preventDefault();
                
                // Validar formulario
                if (!clienteForm.checkValidity()) {
                    e.stopPropagation();
                    clienteForm.classList.add('was-validated');
                    return;
                }
                
                if (editando) {
                    actualizarCliente();
                } else {
                    agregarCliente();
                }
                
                clienteForm.classList.remove('was-validated');
            }
            
            function agregarCliente() {
                // Generar nuevo ID
                const nuevoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
                
                // Crear nuevo cliente
                const nuevoCliente = {
                    id: nuevoId,
                    nombre: nombre.value.trim(),
                    apellido: apellido.value.trim(),
                    email: email.value.trim(),
                    telefono: telefono.value.trim(),
                    dni: dni.value.trim(),
                    direccion: direccion.value.trim()
                };
                
                // Añadir a la lista
                clientes.push(nuevoCliente);
                
                // Guardar y actualizar UI
                saveClientes();
                renderizarTabla();
                limpiarFormulario();
                
                // Mostrar notificación
                mostrarNotificacion('success', 'Cliente agregado correctamente');
                
                // Simular llamada a API para notificación por email
                enviarNotificacionEmail(nuevoCliente, 'nuevo');
            }
            
            function editarCliente(id) {
                // Buscar cliente
                const cliente = clientes.find(c => c.id === id);
                
                if (!cliente) return;
                
                // Cambiar estado a edición
                editando = true;
                formTitle.textContent = 'Editar Cliente';
                
                // Rellenar formulario
                clienteId.value = cliente.id;
                nombre.value = cliente.nombre;
                apellido.value = cliente.apellido;
                email.value = cliente.email;
                telefono.value = cliente.telefono;
                dni.value = cliente.dni;
                direccion.value = cliente.direccion || '';
                
                // Scroll al formulario
                clienteForm.scrollIntoView({ behavior: 'smooth' });
            }
            
            function actualizarCliente() {
                const id = parseInt(clienteId.value);
                const index = clientes.findIndex(c => c.id === id);
                
                if (index === -1) return;
                
                // Actualizar datos
                const clienteActualizado = {
                    id: id,
                    nombre: nombre.value.trim(),
                    apellido: apellido.value.trim(),
                    email: email.value.trim(),
                    telefono: telefono.value.trim(),
                    dni: dni.value.trim(),
                    direccion: direccion.value.trim()
                };
                
                clientes[index] = clienteActualizado;
                
                // Guardar y actualizar UI
                saveClientes();
                renderizarTabla();
                limpiarFormulario();
                
                // Mostrar notificación
                mostrarNotificacion('success', 'Cliente actualizado correctamente');
                
                // Simular llamada a API para notificación por email
                enviarNotificacionEmail(clienteActualizado, 'actualizado');
            }
            
            function eliminarCliente(id) {
                // Confirmar eliminación
                if (!confirm('¿Está seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
                    return;
                }
                
                // Encontrar cliente para la notificación
                const clienteEliminado = clientes.find(c => c.id === id);
                
                // Filtrar la lista
                clientes = clientes.filter(c => c.id !== id);
                
                // Guardar y actualizar UI
                saveClientes();
                renderizarTabla();
                
                // Si estábamos editando este cliente, limpiar formulario
                if (editando && parseInt(clienteId.value) === id) {
                    limpiarFormulario();
                }
                
                // Mostrar notificación
                mostrarNotificacion('warning', 'Cliente eliminado correctamente');
                
                // Simular llamada a API para notificación por email
                enviarNotificacionEmail(clienteEliminado, 'eliminado');
            }
            
            function limpiarFormulario() {
                // Resetear estado
                editando = false;
                formTitle.textContent = 'Nuevo Cliente';
                
                // Limpiar campos
                clienteId.value = '';
                clienteForm.reset();
                clienteForm.classList.remove('was-validated');
            }
            
            function saveClientes() {
                localStorage.setItem('clientes', JSON.stringify(clientes));
            }
            
            function mostrarNotificacion(tipo, mensaje) {
                // Configurar el estilo según el tipo
                notification.className = 'toast align-items-center text-white border-0';
                
                if (tipo === 'success') {
                    notification.classList.add('bg-success');
                    notificationIcon.className = 'fas fa-check-circle me-2';
                } else if (tipo === 'warning') {
                    notification.classList.add('bg-warning');
                    notificationIcon.className = 'fas fa-exclamation-circle me-2';
                } else if (tipo === 'danger') {
                    notification.classList.add('bg-danger');
                    notificationIcon.className = 'fas fa-times-circle me-2';
                }
                
                // Establecer mensaje
                notificationMessage.textContent = mensaje;
                
                // Mostrar notificación
                notification.classList.add('show');
                
                // Ocultar después de 3 segundos
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }
            
            function enviarNotificacionEmail(cliente, accion) {
                // Esta función simularía una llamada a API para enviar un email
                console.log(`Enviando notificación de ${accion} para el cliente:`, cliente);
                // Aquí se conectaría con el "Magic Loop" para el envío real del email
            }
        });