const express = require('express');
const router = express.Router();
const cart_controller = require('../controllers/cart_controller');


// ------------------ Ruta de redireccionamiento ------------------
router.get('/', (req, res) => {
    res.redirect('/cart/create');
});

// ------------------ Rutas de registro ------------------
router.get('/create', cart_controller.render_cart_form);
router.post('/create', cart_controller.create_cart);

// ------------------ Ruta de listado ------------------
router.get('/list', cart_controller.list_carts);

// ------------------ Ruta de edicion ------------------
router.get('/edit/:cart_id', cart_controller.render_edit_form);
router.post('/edit/:cart_id', cart_controller.edit_cart);

// ------------------ Ruta de confirmación de la compra ------------------
router.post('/confirm_purchase/:cart_id', cart_controller.modify_status);

// ------------------ Ruta de eliminación ------------------
router.post('/delete/:cart_id', cart_controller.delete_cart);

// ------------------ Ruta de eliminación ------------------
router.get('/detail/:cart_id', cart_controller.see_cart_detail);

module.exports = router;