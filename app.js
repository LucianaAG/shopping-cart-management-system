// ------------------ Librerías ------------------
const express = require('express'); // importa express para poder manejar rutas, peticiones HTTP y respuestas
const app = express(); // crea una aplicación de express
require('dotenv').config(); // importa dotenv y llama a config() para que lea el archivo .env y cargué las variables en process.env
const session = require('express-session'); // importa express-session para manejar sesiones de usuario y guardar sus datos mientras navega
const {create} = require('express-handlebars'); // integra handlebars con express para renderizar HTML con datos del servidor
const flash = require('connect-flash'); // flash para mostrar mensajes de exito, error o advertencia a los usuarios


// ------------------ Controladores ------------------
const home_controller = require('./controllers/home_controller');
const category_router = require('./routes/category_routes');


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
app.use(session({ // permite mantener sesiones de usuario en el servidor
    secret: process.env.COD_ENCRIPTATION,
    resave: false,
    saveUninitialized: false,
    name: 'secret-name',
    cookie: {expires: 600000}
}));

app.use(flash()); // permite almacenar mensajes temporales
app.use((request, response, next) =>{
    response.locals.success_msg = request.flash('success_msg');
    response.locals.error_msg = request.flash('error_msg');
    next(); // pasa el control al siguiente middleware o ruta.
});
app.use(express.static(__dirname + '/assets')); // permite acceder a los archivos estáticos


// ------------------ Rutas ------------------
app.get('/', home_controller.home); // /
app.get('/home', home_controller.home); // Nuevo: /home
app.use('/category', category_router); // /category/create, /category/list


// ------------------ Base de Datos ------------------
const {sequelize_connection, ensure_database} = require('./database/conexion_mysql_db');
(
    async() => {
        try {
            await ensure_database();
            await sequelize_connection.sync();
            console.log('Base de datos y tablas listas');

            app.listen(process.env.PORT, () => {
                console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
            });
        } catch (error) {
            console.error('Error al inicializar la BD: ', error);
    }
})();