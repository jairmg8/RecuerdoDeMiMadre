 alert('asdasd');
 
 document.addEventListener('DOMContentLoaded', function() {
            // Referencias DOM
            const productoForm = document.getElementById('productoForm');
            const formTitle = document.getElementById('form-title');
            const productoId = document.getElementById('productoId');
            const nombre = document.getElementById('nombre');
            const descripcion = document.getElementById('descripcion');
            const precio = document.getElementById('precio');
            const stock = document.getElementById('stock');
            const categoria = document.getElementById('categoria');
            const marca = document.getElementById('marca');
            const activo = document.getElementById('activo');
            const btnCancelar = document.getElementById('btnCancelar');
            const productosTableBody = document.getElementById('productosTableBody');
            const totalProductos = document.getElementById('totalProductos');
            const notification = document.getElementById('notification');
            const notificationIcon = document.getElementById('notificationIcon');
            const notificationMessage = document.getElementById('notificationMessage');
            
            // Variables globales
            let productos = [];
            let editando = false;
            
            // Inicializar la aplicación
            init();
            
            function init() {
                // Cargar datos desde localStorage o usar datos de ejemplo
                const storedProductos = localStorage.getItem('productos');
                if (storedProductos) {
                    productos = JSON.parse(storedProductos);
                } else {
                    // Datos de ejemplo
                    productos = [
                        {
                            id: 1,
                            nombre: 'Café Premium',
                            descripcion: 'Granos 100% Arábica',
                            precio: 9.99,
                            stock: 50,
                            categoria: 'Bebidas',
                            marca: 'CoffeeCo',
                            activo: true
                        },
                        {
                            id: 2,
                            nombre: 'Taza Cerámica',
                            descripcion: 'Taza 350ml',
                            precio: 4.50,
                            stock: 150,
                            categoria: 'Accesorios',
                            marca: 'HomeStyle',
                            activo: true
                        },
                        {
                            id: 3,
                            nombre: 'Café Descafeinado',
                            descripcion: 'Sin cafeína',
                            precio: 8.50,
                            stock: 30,
                            categoria: 'Bebidas',
                            marca: 'CoffeeCo',
                            activo: false
                        }
                    ];
                    // Guardar en localStorage
                    saveProductos();
                }
                
                // Renderizar la tabla
                renderizarTabla();
                
                // Configurar event listeners
                productoForm.addEventListener('submit', handleSubmit);
                btnCancelar.addEventListener('click', limpiarFormulario);
            }
            
            function renderizarTabla() {
                // Limpiar tabla
                productosTableBody.innerHTML = '';
                
                // Actualizar contador
                totalProductos.textContent = productos.length;
                
                // Si no hay productos, mostrar mensaje
                if (productos.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = '<td colspan="9" class="text-center py-4">No hay productos registrados</td>';
                    productosTableBody.appendChild(row);
                    return;
                }
                
                // Renderizar cada producto
                productos.forEach(producto => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${producto.id}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion || '-'}</td>
                        <td>${producto.precio.toFixed(2)}</td>
                        <td>${producto.stock}</td>
                        <td>${producto.categoria}</td>
                        <td>${producto.marca}</td>
                        <td>
                            <span class="badge ${producto.activo ? 'bg-success' : 'bg-secondary'}">
                                ${producto.activo ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-warning btn-action edit-btn" data-id="${producto.id}" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-action delete-btn" data-id="${producto.id}" title="Eliminar">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    `;
                    
                    // Añadir el row a la tabla
                    productosTableBody.appendChild(row);
                    
                    // Añadir event listeners para editar y eliminar
                    const editBtn = row.querySelector('.edit-btn');
                    const deleteBtn = row.querySelector('.delete-btn');
                    
                    editBtn.addEventListener('click', () => editarProducto(producto.id));
                    deleteBtn.addEventListener('click', () => eliminarProducto(producto.id));
                });
            }
            
            function handleSubmit(e) {
                e.preventDefault();
                
                // Validar formulario
                if (!productoForm.checkValidity()) {
                    e.stopPropagation();
                    productoForm.classList.add('was-validated');
                    return;
                }
                
                if (editando) {
                    actualizarProducto();
                } else {
                    agregarProducto();
                }
                
                productoForm.classList.remove('was-validated');
            }
            
            function agregarProducto() {
                // Generar nuevo ID
                const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
                
                // Crear nuevo producto
                const nuevoProducto = {
                    id: nuevoId,
                    nombre: nombre.value.trim(),
                    descripcion: descripcion.value.trim(),
                    precio: parseFloat(precio.value),
                    stock: parseInt(stock.value),
                    categoria: categoria.value.trim(),
                    marca: marca.value.trim(),
                    activo: activo.checked
                };
                
                // Añadir a la lista
                productos.push(nuevoProducto);
                
                // Guardar y actualizar UI
                saveProductos();
                renderizarTabla();
                limpiarFormulario();
                
                // Mostrar notificación
                mostrarNotificacion('success', 'Producto agregado correctamente');
                
                // Simular llamada a API para notificación por email
                enviarNotificacionEmail(nuevoProducto, 'nuevo');
            }
            
            function editarProducto(id) {
                // Buscar producto
                const producto = productos.find(p => p.id === id);
                
                if (!producto) return;
                
                // Cambiar estado a edición
                editando = true;
                formTitle.textContent = 'Editar Producto';
                
                // Rellenar formulario
                productoId.value = producto.id;
                nombre.value = producto.nombre;
                descripcion.value = producto.descripcion || '';
                precio.value = producto.precio;
                stock.value = producto.stock;
                categoria.value = producto.categoria;
                marca.value = producto.marca;
                activo.checked = producto.activo;
                
                // Scroll al formulario
                productoForm.scrollIntoView({ behavior: 'smooth' });
            }
            
            function actualizarProducto() {
                const id = parseInt(productoId.value);
                const index = productos.findIndex(p => p.id === id);
                
                if (index === -1) return;
                
                // Actualizar datos
                const productoActualizado = {
                    id: id,
                    nombre: nombre.value.trim(),
                    descripcion: descripcion.value.trim(),
                    precio: parseFloat(precio.value),
                    stock: parseInt(stock.value),
                    categoria: categoria.value.trim(),
                    marca: marca.value.trim(),
                    activo: activo.checked
                };
                
                productos[index] = productoActualizado;
                
                // Guardar y actualizar UI
                saveProductos();
                renderizarTabla();
                limpiarFormulario();
                
                // Mostrar notificación
                mostrarNotificacion('success', 'Producto actualizado correctamente');
                
                // Simular llamada a API para notificación por email
                enviarNotificacionEmail(productoActualizado, 'actualizado');
            }
            
            function eliminarProducto(id) {
                // Confirmar eliminación
                if (!confirm('¿Está seguro de eliminar este producto? Esta acción no se puede deshacer.')) {
                    return;
                }
                
                // Encontrar producto para la notificación
                const productoEliminado = productos.find(p => p.id === id);
                
                // Filtrar la lista
                productos = productos.filter(p => p.id !== id);
                
                // Guardar y actualizar UI
                saveProductos();
                renderizarTabla();
                
                // Si estábamos editando este producto, limpiar formulario
                if (editando && parseInt(productoId.value) === id) {
                    limpiarFormulario();
                }
                
                // Mostrar notificación
                mostrarNotificacion('warning', 'Producto eliminado correctamente');
                
                // Simular llamada a API para notificación por email
                enviarNotificacionEmail(productoEliminado, 'eliminado');
            }
            
            function limpiarFormulario() {
                // Resetear estado
                editando = false;
                formTitle.textContent = 'Nuevo Producto';
                
                // Limpiar campos
                productoId.value = '';
                productoForm.reset();
                activo.checked = true;
                productoForm.classList.remove('was-validated');
            }
            
            function saveProductos() {
                localStorage.setItem('productos', JSON.stringify(productos));
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
            
            function enviarNotificacionEmail(producto, accion) {
                // Esta función simularía una llamada a API para enviar un email
                console.log(`Enviando notificación de ${accion} para el producto:`, producto);
                // Aquí se conectaría con el "Magic Loop" para el envío real del email
            }
        });