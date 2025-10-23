const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');
const {ensure_authenticated} = require('../middlewares/authentication');


// ------------------ Rutas de registro ------------------
router.get('/register', user_controller.render_user_register_form);
router.post('/register', user_controller.user_register);

// ------------------ Ruta de login ------------------
router.get('/login', user_controller.render_user_login_form);
router.post('/login', user_controller.login_user)

// ------------------ Rutas de logout ------------------
router.get('/logout', ensure_authenticated, user_controller.logout_user);

// ------------------ Ruta de perfil ------------------
router.get('/profile', ensure_authenticated, user_controller.render_profile);
router.post('/profile', ensure_authenticated, user_controller.edit_profile);

// ------------------ Rutas de listado ------------------
router.get('/list', ensure_authenticated, user_controller.list_all_users);
router.get('/record', ensure_authenticated, user_controller.user_cart_history);
router.get('/detail/:cart_id', ensure_authenticated, user_controller.user_cart_detail);

module.exports = router;