const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/product_controller');
const {upload} = require('../config/multer');
const {product_validations} = require('./validators/product_validators');


// ------------------ Ruta de redireaccionamiento ------------------
router.get('/', (req, res) => {
    res.redirect('/product/create');
});

// ------------------ Ruta de renderizado ------------------
router.get('/create', product_controller.render_product_form);

// ------------------ Ruta de registro ------------------
router.post('/create', upload.single('image'), product_validations, product_controller.create_product);

// ------------------ Ruta de listado ------------------
router.get('/list', product_controller.list_products);

// ------------------ Ruta para eliminar producto ------------------
router.post('/delete/:product_id', product_controller.delete_product);

// ------------------ Ruta para mostrar formulario de edición ------------------
router.get('/edit/:product_id', product_controller.render_edit_form);

// ------------------ Ruta para procesar la edición ------------------
router.post('/edit/:product_id', upload.single('image'), product_validations, product_controller.update_product);


module.exports = router;