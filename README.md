🛒 Shopping Cart Management System
Aplicación web completa desarrollada con Node.js, Express y MySQL para la gestión de usuarios, productos, categorías y un robusto sistema de carrito de compras en línea. La interfaz de usuario está desarrollada con Bootstrap para un diseño moderno y responsivo.

Descripción
Este sistema tiene el objetivo de gestionar un proceso de comercio electrónico completo. Permite a los usuarios registrados (clientes) navegar por un catálogo, agregar productos, finalizar compras y revisar su historial. También provee las herramientas administrativas necesarias para gestionar el inventario y las categorías.

Las entidades clave del sistema son:

User: Registro y autenticación de clientes.

Category: Agrupación de productos.

Product: Ítems con nombre, precio, stock, stock mínimo e imagen.

Cart: Representa la compra (activa o confirmada).

Cart_items: Detalle de productos dentro de un carro (cantidad y precio de compra).

Funcionalidades Principales
Registro y Autenticación: Registro de usuarios, inicio y cierre de sesión seguro mediante Passport y Bcrypt (para el encriptado de contraseñas).

ABMC (CRUD) Completo: Altas, Bajas, Modificaciones y Consultas sobre Usuarios, Categorías, Productos, Carro e Ítems del Carro.

Gestión de Catálogo: Muestra los productos disponibles con su información relevante (imagen, stock, precio).

Control de Stock en Tiempo Real: Las validaciones impiden agregar al carrito cantidades mayores al stock disponible.

Actualización Automática de Stock: El stock de productos se actualiza automáticamente al agregar o eliminar ítems del carro, y al Confirmar la compra.

Validación de Datos: Uso de express-validator para asegurar la calidad de los datos de entrada (ej. precio mayor a cero, stock no negativo).

Histórico de Compras: Listado de carritos en estado Confirmado para que el usuario pueda consultar sus pedidos anteriores.

Gestión de Archivos: Subida de imágenes de productos gestionada por Multer.

🛠️ Tecnologías Utilizadas
Este proyecto está construido con el siguiente stack tecnológico:

Categoría

Tecnología

Propósito

Backend

Node.js

Entorno de ejecución principal.



Express

Framework para la gestión del servidor y rutas.

Base de Datos

Sequelize

ORM para modelado y consultas a la base de datos.



MySQL2

Driver de conexión a MySQL.

Autenticación

Passport / Bcrypt

Autenticación de usuarios y encriptación de contraseñas.

Sesión / Vistas

express-session

Mantenimiento de la sesión de usuario.



Handlebars (HBS)

Motor de plantillas para renderizar las vistas.

Herramientas

dotenv

Gestión de variables de entorno (.env).



nodemon

Reinicio automático del servidor en desarrollo.

Testing

Jest / NYC (Istanbul)

Framework de pruebas y medición de cobertura de código.

💻 Instalación y Ejecución
1. Requisitos
Node.js (incluye npm)

Servidor de base de datos MySQL

2. Configuración Inicial
Clonar o descargar este repositorio.

Acceder a la carpeta del proyecto.

Instalar las dependencias (se requiere ejecutar npm init -y previamente):

npm install

3. Configuración de Entorno
Crear el archivo .env en la raíz del proyecto para definir las variables de conexión a la base de datos y la clave secreta de sesión.

# Ejemplo de configuración para .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=shopping_cart_db
SESSION_SECRET=SUPER_CLAVE_SECRETA

4. Ejecutar la Aplicación
Asegúrate de que el servidor MySQL esté corriendo.

Iniciar el servidor en modo desarrollo:

npm run dev
# (Dependiendo de tu script de inicio, podría ser `node app.js` o similar)

La aplicación estará disponible para usar en su puerto configurado (http://localhost:<PUERTO>).
