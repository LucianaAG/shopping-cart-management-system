const { response } = require('express');
const user = require('../models/user');
const {validationResult} = require('express-validator');
const { cart, cart_items, product } = require('../models/associations');

// ------------------ Controlador de renderizado ------------------
module.exports.render_cart_form = async (request, response) => {

    try {
        const users = await user.findAll(
            {
                order: [
                    ['name', 'ASC'],
                    ['email', 'ASC'],
                    ['password', 'ASC']
            ],
                raw: true // objeto plano
            });

            response.render('cart/create', {users});
    } catch (error) {
        console.error('error al cargar usuarios', error.message);
        request.flash('error_msg', 'no se pudieron cargar los usuarios');
        response.redirect('/');
    }
};

// ------------------ Controlador de registro ------------------
module.exports.create_cart = async (request, response) => {
    // Evitar desestructuración de undefined
    const date = request.body ? request.body.date : null;
    const state = request.body ? request.body.state : null;
    const user_id = request.body ? request.body.user_id : null;

    if (!date) {
        request.flash('error_msg', 'Debe completar la fecha del carrito');
        return response.redirect('/cart/create');
    }

    try {
        const newCart = await cart.create({
            date,
            state,
            user_id: user_id ? parseInt(user_id) : null
        });
        console.log('Nuevo carrito creado:', newCart.toJSON());
        request.flash('success_msg', 'El carrito se registró con éxito');
        response.redirect('/cart/create');
    } catch (error) {
        console.error('Error al crear carrito:', error);
        request.flash('error_msg', 'Ocurrió un error al registrar el carrito');
        response.redirect('/cart/create');
    }
};

// ------------------ Controlador de listado ------------------
module.exports.list_carts = async (request, response) => {
    try {
        const carts = await cart.findAll({raw: true});
        response.render('cart/list', {carts});
    } catch (error) {
        console.log('Error al obtener los registros', error.message);
        request.flash('error_msg', 'Ocurrió un error al obtener los registros');
        response.redirect('/home');
    }
};

// ------------------ Controlador de modificación ------------------
module.exports.render_edit_form = async (request, response) => {
    try {
        const cart_id =  request.params.cart_id;
        const cart_data_raw = await cart.findByPk(cart_id, {raw: true});

        const cart_data = {
        ...cart_data_raw,
        date: cart_data_raw.date // si es DATEONLY, esto ya es 'YYYY-MM-DD'
    };

        if (!cart_data) {
            request.flash('error_msg', 'No se ha encontrado el registro');
            response.redirect('/cart/list');
        }

        const users = await user.findAll({order: [['name', 'ASC']], raw: true});
        response.render('cart/edit', {cart: cart_data, users});
    } catch (error) {
        console.log('Error el obtener el registro', error.message);
        request.flash('error_msg', 'error al obtener el registro');
        response.redirect('/cart/list');
    }
};

// ------------------ Controlador para actualizar los datos en la bd ------------------
module.exports.edit_cart = async (request, response) => {
    const errors = validationResult(request);
    const cart_id = request.params.cart_id;

    if (!errors.isEmpty()) {
        return response.render('cart/edit',
            {
                errors: errors.array(),
                cart: {
                    date: request.body.date,
                    state: request.body.state,
                    user_id: request.body.user_id

                }
            }
        );
    }

     try {
        const {date} = request.body;
        const state = request.body.state;
        const user_int = request.body.user_id ? parseInt(request.body.user_id) : null;
        const update_data = {date, state, user_id: user_int};
        await cart.update(update_data, {where: {cart_id}});
        request.flash('success_msg', 'el registro se ha actualizado con exito');
        response.redirect('/cart/list');
     } catch (error) {
        console.error('error al actualizar el registro', error.message);

        if (error.parent) {
            console.error('Detalle SQL:', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'ocurrió un error al actualizar el registro');
        response.redirect('/cart/list');
     }
};

// ------------------ Controlador para confirmar compra ------------------
module.exports.modify_status = async (request, response) => {
    const cart_id = request.params.cart_id;

    try {
        const cart_instance = await cart.findByPk(cart_id);

        if (!cart_instance) {
            request.flash('error_msg', 'Carrito no encontrado');
            return response.redirect('/cart/list');
        }

        if (cart_instance.state === 'activo') {
            cart_instance.state = 'confirmado';
            await cart_instance.save();
            request.flash('success_msg', 'La compra se ha confirmado');
        } else {
            request.flash('error_msg', 'El carrito ya estaba confirmado');
        }

        return response.redirect('/cart/list');

    } catch (error) {
        console.error('Error al confirmar la compra:', error.message);

        if (error.parent) {
            console.error('Detalle SQL:', error.parent.sqlMessage);
        }

        request.flash('error_msg', 'Ocurrió un error al confirmar la compra');
        return response.redirect('/cart/list');
    }
};

// ------------------ Controlador para ver detalle ------------------
module.exports.see_cart_detail = async (request, response) => {
        try {
            const cart_id = request.params.cart_id;

            // muestra todos los cart_items donde cart_id == al cart_id extraido de los params de la request
            const cart_data = await cart.findByPk(cart_id, { // busca en la bd el car con el id especificado
                include: [ // define que el obj cart_data incluirá los datos de cart_items y los datos del user asociados a cart
                    {
                        model: cart_items,
                        as: 'items',
                        include: [
                            {
                                model: product,
                                as: 'product_relation'
                            }
                        ]
                    },
                    {
                        model: user,
                        as: 'user'
                    }
                ]
        });

        if (!cart_data) {
            request.flash('error_msg', 'No se encontró el carrito especificado');
            return response.redirect('/cart/list');
        }

        response.render('cart/detail', { cart: cart_data.toJSON() });

    } catch (error) {
        console.error('Error al obtener detalle del carrito:', error.message);
        request.flash('error_msg', 'Ocurrió un error al cargar el detalle del carrito');
        response.redirect('/cart/list');
    }
};

// ------------------ Controlador para eliminar registro ------------------
module.exports.delete_cart = async (request, response) => {
    try {
        const {cart_id} = request.params;
        await cart.destroy({where: {cart_id: cart_id}});
        request.flash('success_msg', 'el registro se ha eliminado con exito');
        response.redirect('/cart/list');
    } catch (error) {
        console.log('error al eliminar el registro', error.message);
        request.flash('error_msg', 'ocurrió un error al eliminar el registro');
        response.redirect('/cart/list');
    }
};