const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/product_controller');
const { upload } = require('../config/multer');
const { product_validations } = require('./validators/product_validators');

// ------------------ Ruta de redireccionamiento ------------------
router.get('/', (req, res) => {
  res.redirect('/product/create');
});

// ------------------ Ruta de renderizado del formulario ------------------
router.get('/create', product_controller.render_product_form);

// ------------------ Ruta de registro (crear producto) ------------------
router.post('/create', upload.single('image'), product_validations, product_controller.create_product);

// ------------------ Ruta de listado ------------------
router.get('/list', product_controller.list_products);

// ------------------ Ruta para eliminar producto ------------------
router.post('/delete/:product_id', product_controller.delete_product);

// ------------------ Ruta para mostrar formulario de edición ------------------
router.get('/edit/:product_id', product_controller.render_edit_form);

// ------------------ Ruta para procesar la edición ------------------
router.post('/edit/:product_id', upload.single('image'), product_validations, product_controller.update_product);


// ------------------ Endpoints JSON para Swagger ------------------
// ------------------ Listar productos JSON ------------------
/**
 * @swagger
 * /product/api:
 *   get:
 *     summary: Lista todos los productos (JSON)
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/api', product_controller.list_products_json);

/**
 * @swagger
 * /product/api/create:
 *   post:
 *     summary: Crear producto (JSON)
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               minimum_stock: { type: integer }
 *               category: { type: integer }
 *     responses:
 *       200:
 *         description: Producto creado
 */
router.post('/api/create', product_controller.create_product_json);

/**
 * @swagger
 * /product/api/edit/{product_id}:
 *   put:
 *     summary: Actualizar producto (JSON)
 *     tags:
 *       - Productos
 *     parameters:
 *       - name: product_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               price: { type: number }
 *               stock: { type: integer }
 *               minimum_stock: { type: integer }
 *               category: { type: integer }
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put('/api/edit/:product_id', product_controller.update_product_json);

/**
 * @swagger
 * /product/api/delete/{product_id}:
 *   delete:
 *     summary: Eliminar producto (JSON)
 *     tags:
 *       - Productos
 *     parameters:
 *       - name: product_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.delete('/api/delete/:product_id', product_controller.delete_product_json);

module.exports = router;
