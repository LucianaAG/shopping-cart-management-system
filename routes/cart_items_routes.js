const express = require('express');
const router = express.Router();
const cart_items_controller = require('../controllers/cart_items_controller');

// ------------------ Ruta de redireccionamiento ------------------
router.get('/', (req, res) => {
    res.redirect('/cart_items/create');
});

// ------------------ Rutas de registro ------------------
router.get('/create', cart_items_controller.render_cart_items_form);
router.post('/create', cart_items_controller.create_cart_items);

// ------------------ Ruta de listado ------------------
router.get('/list', cart_items_controller.list_cart_items);

// ------------------ Ruta de edicion ------------------
router.get('/edit/:cart_item_id', cart_items_controller.render_edit_form);
router.post('/edit/:cart_item_id', cart_items_controller.edit_cart_items);

// ------------------ Ruta de eliminación ------------------
router.post('/delete/:cart_item_id', cart_items_controller.delete_cart_items);
module.exports = router;