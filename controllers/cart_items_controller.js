const cart_items = require('../models/cart_items');
const product =  require('../models/product');
const cart = require('../models/cart');
const {validationResult} = require('express-validator');



// ------------------ Controlador de renderizado ------------------
module.exports.render_cart_items_form = async (request, response) => {
    try {
        const products = await product.findAll(
            {
                order: [
                    ['name', 'ASC'],
                    ['price', 'ASC'],
                    ['stock', 'ASC'],
                    ['minimum_stock', 'ASC'],
                    ['image', 'ASC'],
                    ['category', 'ASC']
                ],
                raw: true
            });
        
        const carts = await cart.findAll(
            {
                order: [
                    ['date', 'ASC'],
                    ['state', 'ASC'],
                    ['user_id', 'ASC']
                ],
                raw: true
            });

        response.render('cart_items/create', {products, carts});
    } catch (error) {
        console.error('error al cargar los productos y las compras', error.message);
        request.flash('error_msg', 'no se pudieron cargar los productos y las compras');
        response.redirect('/');
    }
};

// ------------------ Controlador de registro ------------------
module.exports.create_cart_items =  async (request, response) => {
    const { amount, price, cart_id, product_id } = request.body;

    try {
        await cart_items.create({
            amount,
            price,
            cart_id: cart_id ? Number.parseInt(cart_id) : null,
            product_id: product_id ? Number.parseInt(product_id) : null
        });

        request.flash('success_msg', 'El detalle se registró con exito');
        response.redirect('/cart_items/create');

    } catch (error) {
        console.error('Error al registrar el detalle', error);
        request.flash('error_msg', 'Ocurrió un error al registrar el detalle');
        response.redirect('/cart_items/create');
    }
};

// ------------------ Controlador de listado ------------------
module.exports.list_cart_items = async (request, response) => {

    try {
        const carts_items = await cart_items.findAll({raw: true});
        response.render('cart_items/list', {carts_items});
    } catch (error) {
        console.error('Error al listar los registros', error);
        request.flash('error_msg', 'Ocurrió un error al listar los registros');
        response.redirect('/home');
    }
};

// ------------------ Controlador de modificacion ------------------
module.exports.render_edit_form = async (request, response) => {
    try {
        const cart_item_id = request.params.cart_item_id;
        console.log('cart_item_id recibido en la URL:', cart_item_id); // <-- debug

        // Buscar el registro por su ID
        const cart_data_raw = await cart_items.findByPk(cart_item_id, { raw: true });
        console.log('cart_data_raw obtenido de la DB:', cart_data_raw); // <-- debug

        if (!cart_data_raw) {
            request.flash('error_msg', 'No se ha encontrado el registro');
            return response.redirect('/cart_items/list');            
        }

        // Obtener productos para el select
        const products = await product.findAll({
            order: [
                ['name', 'ASC'],
                ['price', 'ASC'],
                ['stock', 'ASC'],
                ['minimum_stock', 'ASC'],
                ['image', 'ASC'],
                ['category', 'ASC']
            ],
            raw: true
        });
        
        // Obtener compras para el select
        const carts = await cart.findAll({
            order: [
                ['date', 'ASC'],
                ['state', 'ASC'],
                ['user_id', 'ASC']
            ],
            raw: true
        });

        // PASAR EL REGISTRO A LA VISTA CON EL NOMBRE 'cart_items'
        response.render('cart_items/edit', {
            products,
            carts,
            cart_items: cart_data_raw  // <- coincide con la vista
        });

    } catch (error) {
        console.error('Error al obtener el registro', error.message);
        request.flash('error_msg', 'error al obtener el registro');
        response.redirect('/cart_items/list');
    }
};
// ------------------ Controlador para actualizar los datos en la bd ------------------

module.exports.edit_cart_items = async (request, response) => {
    const errors = validationResult(request);
    const cart_item_id = request.params.cart_item_id

    if (!errors.isEmpty()) {
        return response.render('cart_items/edit',
            {
                errors: errors.array(),
                cart_items: {
                    amount: request.body.amount,
                    price: request.body.price,
                    cart_id: request.body.cart_id,
                    product_id: request.body.product_id
                }
            }
        );
    }

    try {
        const amount = request.body.amount;
        const price = request.body.price;
        const cart_id = request.body.cart_id ? Number.parseInt(request.body.cart_id) : null;
        const product_id = request.body.product_id ? Number.parseInt(request.body.product_id) : null;

        const update_data = {amount, price, cart_id: cart_id, product_id: product_id};
        await cart_items.update(update_data, {where: {cart_item_id}});
        request.flash('success_msg', 'el registro se ha actualizado con exito');
        response.redirect('/cart_items/list');
    } catch (error) {
        console.error('error al actualizar el registro', error.message);

        if (error.parent) {
            console.error('Detalle SQL', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'ocurrió un error al actualizar el registro');
        response.redirect('/cart_items/list');
    }
};

// ------------------ Controlador para eliminar ------------------

module.exports.delete_cart_items = async (request, response) => {
    try {
        const cart_item_id = request.params.cart_item_id;
        await cart_items.destroy({where: {cart_item_id}});
        request.flash('success_msg', 'El registro se ha eliminado con exito');
        response.redirect('/cart_items/list');
    } catch (error) {
        console.log('error al eliminar el registro', error.message);
        request.flash('error_msg', 'ocurrió un error al eliminar el registro');
        response.redirect('/cart_items/list');
    }
};

