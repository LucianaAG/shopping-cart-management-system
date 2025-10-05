# Shopping Cart Management System

Aplicación web completa desarrollada con **Node.js**, **Express** y **MySQL** para la gestión de usuarios, productos, categorías y un robusto sistema de carrito de compras en línea. La interfaz de usuario está desarrollada con **Bootstrap** para un diseño moderno y responsivo.

# Entidades clave:

- **User**: Registro y autenticación de clientes.  
- **Category**: Agrupación de productos.  
- **Product**: Ítems con nombre, precio, stock, stock mínimo e imagen.  
- **Cart**: Representa la compra (activa o confirmada).  
- **Cart_items**: Detalle de productos dentro de un carrito (cantidad y precio de compra).  

# Funcionalidades Principales

- **Registro y Autenticación**: Inicio de sesión seguro con Passport y Bcrypt.  
- **ABMC (CRUD) Completo**: Altas, bajas, modificaciones y consultas sobre Usuarios, Categorías, Productos, Carritos e Ítems del Carrito.  
- **Gestión de Catálogo**: Muestra productos disponibles con imagen, stock y precio.  
- **Control de Stock en Tiempo Real**: Evita agregar al carrito cantidades mayores al stock disponible.  
- **Actualización Automática de Stock**: Al agregar/eliminar ítems o confirmar la compra.  
- **Validación de Datos**: Uso de express-validator para asegurar la calidad de los datos (precio > 0, stock no negativo).  
- **Histórico de Compras**: Consulta de carritos confirmados por el usuario.  
- **Gestión de Archivos**: Subida de imágenes de productos gestionada con Multer.  

# Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución principal para el backend.  
- **Express**: Framework de servidor y manejo de rutas HTTP.  
- **Sequelize**: ORM para modelado y consultas a la base de datos.  
- **MySQL2**: Driver para la conexión con MySQL.  
- **Passport / Bcrypt**: Manejo de autenticación y encriptación de contraseñas.  
- **express-session**: Mantenimiento de sesiones de usuario.  
- **Handlebars (HBS)**: Motor de plantillas para renderizar vistas dinámicas.  
- **dotenv**: Gestión de variables de entorno en desarrollo y producción.  
- **nodemon**: Reinicio automático del servidor durante desarrollo.  
- **Jest / NYC (Istanbul)**: Framework de pruebas unitarias y cobertura de código.  

# Documentación de la API (Swagger)

Puedes consultar toda la documentación de la API y probar los endpoints directamente en Swagger:  

[📄 Swagger API Documentation](http://localhost:5000/api-docs)

