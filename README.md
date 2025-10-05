# Shopping Cart Management System

Aplicación web completa desarrollada con **Node.js**, **Express** y **MySQL** para la gestión de usuarios, productos, categorías y un robusto sistema de carrito de compras en línea. La interfaz de usuario está desarrollada con **Bootstrap** para un diseño moderno y responsivo.

---

# Descripción

Este sistema tiene como objetivo gestionar un proceso completo de comercio electrónico. Permite a los usuarios registrados (clientes) navegar por un catálogo, agregar productos al carrito, finalizar compras y revisar su historial. También provee herramientas administrativas para gestionar el inventario y las categorías.

#Entidades clave:

- **User**: Registro y autenticación de clientes.  
- **Category**: Agrupación de productos.  
- **Product**: Ítems con nombre, precio, stock, stock mínimo e imagen.  
- **Cart**: Representa la compra (activa o confirmada).  
- **Cart_items**: Detalle de productos dentro de un carrito (cantidad y precio de compra).  

---

# Funcionalidades Principales

- **Registro y Autenticación**: Inicio de sesión seguro con Passport y Bcrypt.  
- **ABMC (CRUD) Completo**: Altas, bajas, modificaciones y consultas sobre Usuarios, Categorías, Productos, Carritos e Ítems del Carrito.  
- **Gestión de Catálogo**: Muestra productos disponibles con imagen, stock y precio.  
- **Control de Stock en Tiempo Real**: Evita agregar al carrito cantidades mayores al stock disponible.  
- **Actualización Automática de Stock**: Al agregar/eliminar ítems o confirmar la compra.  
- **Validación de Datos**: Uso de express-validator para asegurar la calidad de los datos (precio > 0, stock no negativo).  
- **Histórico de Compras**: Consulta de carritos confirmados por el usuario.  
- **Gestión de Archivos**: Subida de imágenes de productos gestionada con Multer.  

---

# Tecnologías Utilizadas

| Categoría          | Tecnología             | Propósito                                             |
|-------------------|----------------------|------------------------------------------------------|
| **Backend**       | Node.js               | Entorno de ejecución principal                       |
|                   | Express               | Framework para servidor y rutas                      |
| **Base de Datos** | Sequelize             | ORM para modelado y consultas                        |
|                   | MySQL2                | Driver de conexión a MySQL                            |
| **Autenticación** | Passport / Bcrypt     | Autenticación y encriptación de contraseñas          |
| **Sesión / Vistas** | express-session      | Mantenimiento de sesión de usuario                  |
|                   | Handlebars (HBS)     | Motor de plantillas para renderizar vistas           |
| **Herramientas**  | dotenv                | Gestión de variables de entorno                       |
|                   | nodemon               | Reinicio automático del servidor en desarrollo      |
| **Testing**       | Jest / NYC (Istanbul) | Framework de pruebas y cobertura de código           |


