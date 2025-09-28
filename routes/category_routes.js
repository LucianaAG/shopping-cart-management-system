const express = require('express'); // importa express para el manejo de rutas
const router = express.Router(); // crea un enrutador de express
const category_controller = require('../controllers/category_controller'); // importa al controlador
const {create_category_validations, update_category_validations} = require('./validators/category_validators') // El ./ al inicio indica “desde la misma carpeta donde está este archivo”.

// ------------------ Ruta de redireaccionamiento ------------------
// si el cliente solicita '/customer', express lo redirecciona a '/customer/create'
router.get('/', (req, res) => {
    res.redirect('/category/create');
});

// ------------------ Ruta de renderizado ------------------
// se define la ruta que muestra el form de registro y el controlador que responde a esa ruta (usamos siempre GET)
router.get('/create', category_controller.render_category_form);

// ------------------ Ruta de registro ------------------
router.post('/create', create_category_validations, category_controller.create_category);

// ------------------ Ruta de listado ------------------
router.get("/list", category_controller.list_categories);

// ------------------ Ruta para mostrar formulario de edición ------------------
router.get("/edit/:category_id", category_controller.render_edit_form);

// ------------------ Ruta para procesar la edición ------------------
router.post("/edit/:category_id", update_category_validations, category_controller.update_category);

// ------------------ Ruta para eliminar categoría ------------------
router.post("/delete/:category_id", category_controller.delete_category);

// exporta el router
module.exports = router;