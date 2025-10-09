// ------------------ Librerías ------------------
const express = require('express'); // importa express para poder manejar rutas, peticiones HTTP y respuestas
const app = express(); // crea una aplicación de express
require('dotenv').config(); // importa dotenv y llama a config() para que lea el archivo .env y cargue las variables en process.env
const session = require('express-session'); // importa express-session para manejar sesiones de usuario y guardar sus datos mientras navega
const passport = require('passport'); // importa Passport para autenticación
const {create} = require('express-handlebars'); // integra handlebars con express para renderizar HTML con datos del servidor
const flash = require('connect-flash'); // flash para mostrar mensajes de exito, error o advertencia a los usuarios

// ------------------ Swagger ------------------
const swaggerUi = require('swagger-ui-express'); // sirve para montar la UI de swagger
const swaggerSpec = require('./config/swagger'); // importa la especificación generada de swagger

// ------------------ Routers ------------------
const home_controller = require('./controllers/home_controller');
const category_router = require('./routes/category_routes');
const product_router = require('./routes/product_routes');
const user_router = require('./routes/user_routes');

// ------------------ Configuración Handlebars ------------------
const handlebars_instance = create({ // crea instancia de handlebars
    extname: '.hbs', // define la extension de los archivos
    defaultLayout: 'main' // define el layout principal por defecto
});

app.engine(".hbs", handlebars_instance.engine); // pide a express que use handlebars para procesar archivos .hbs
app.set("view engine", ".hbs"); // establece que cada vista a renderizar usará la extension .hbs
app.set("views", "./views"); // indica a express donde buscar los archivos de vistas

// ------------------ Middlewares ------------------
app.use(express.urlencoded({ extended: true })); // permite que express lea datos enviados desde formularios con POST
app.use(express.json()); // permite que express lea datos en formato JSON enviados en las solicitudes

// ------------------ Sesión ------------------
app.use(session({ // permite mantener sesiones de usuario en el servidor
    secret: process.env.COD_ENCRIPTATION,
    resave: false,
    saveUninitialized: false,
    name: 'secret-name',
    cookie: { expires: 600000 }
}));

// ------------------ Passport ------------------
// configura la estrategia
require('./config/passport')(passport);

// incializa Passport y la sesión
app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); // palmacena mensajes temporales
app.use((req, res, next) => {
    res.locals.user = req.user; // usuario logueado
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); // errores de Passport
    next();
});

app.use(express.static(__dirname + '/assets')); // permite acceder a los archivos estáticos

// ------------------ Montar Swagger UI ------------------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ------------------ Rutas ------------------
app.get('/', home_controller.home); // /
app.get('/home', home_controller.home); // /home
app.use('/category', category_router); // /category/create, /category/list
app.use('/product', product_router); // /product/create, /product/list
app.use('/user', user_router); // /user/register, /user/login, /user/logout, /user/profile

// ------------------ Base de Datos ------------------
const {sequelize_connection, ensure_database} = require('./database/conexion_mysql_db');

const PORT = process.env.PORT || 5000; // Cambiado a puerto 5000 por defecto

(
    async() => {
        try {
            await ensure_database();
            await sequelize_connection.sync();
            console.log('Base de datos y tablas listas');

            // Solo una llamada a listen, después de la inicialización de la BD
            app.listen(PORT, () => {
                console.log('Servidor corriendo en el puerto: ' + PORT);
                console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
            });
        } catch (error) {
            console.error('Error al inicializar la BD: ', error);
        }
})();
