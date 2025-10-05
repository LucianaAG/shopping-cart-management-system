const product = require('../models/product');
const {validationResult} = require('express-validator');
const category = require('../models/category');
const { request } = require('express');

// ------------------ Controlador de renderizado ------------------
module.exports.render_product_form = async(request, response)  => {

    try {
        const categories = await category.findAll({
            order: [['name', 'ASC']],
            raw: true // para que sequalize devuelva objetos planos
        });

        response.render('product/create', { categories });
    } catch (error) {
        console.error('error al cargar categorías:', error.message);
        request.flash('error_msg', 'no se pudieron cargar las categorías');
        response.redirect('/');
    }
}

// ------------------ Controlador de registro ------------------
module.exports.create_product = async (request, response) => {
    const errors = validationResult(request); // verifica si hay errores de validación en los datos que vienen en la request

    if (!errors.isEmpty()) { // si hay errores, se renderiza la vista y se le pasa la lista de errores
        return response.render('product/create',
            {
                errors: errors.array(),
                product: {
                    name: request.body.name,
                    price: request.body.price,
                    stock: request.body.stock,
                    minimum_stock: request.body.minimum_stock,
                    category: request.body.category
                }
            }
        );
    }

    try {
        const {name, price, stock, minimum_stock} = request.body;

        // convierte category a int, porque sequelize lo recibe como string
        const category_int = request.body.category ? parseInt(request.body.category) : null;

        // si multer subió la imagen, la guarda, sino la deja como null
        const image = request.file ? request.file.filename : null;

        // crea el registro en la bd con los datos obtenidos de la request
        await product.create({name, price, stock, minimum_stock, category: category_int, image})

        request.flash('success_msg', 'el producto se registró con exito');
        response.redirect('/product/create');
    } catch (error) {
        console.error('error al crear el producto', error.message);

        if (error.parent) {
             console.error("Detalle SQL:", error.parent.sqlMessage);
        }
        request.flash('error_msg', 'ocurrió un error al registrar el producto');
        response.redirect('/product/create');
    }
};

// ------------------ Controlador de listado ------------------
module.exports.list_products = async (request, response) => {
    try {
        const products = await product.findAll({raw: true});
        response.render('product/list', {products: products});
    } catch (error) {
        console.log('Error al obtener los productos', error.message);
        request.flash('error_msg', 'Ocurrió un error al obtener las categorías');
        response.redirect('/home');
    } 
};

// ------------------ Controlador de modificación ------------------
module.exports.render_edit_form = async (request, response) => {
    try {
        const product_id = request.params.product_id;
        const product_data = await product.findByPk(product_id, {raw: true});

        if (!product_data) {
            request.flash('error_msg', 'No se ha encontrado el registro');
            return response.redirect('/product/list');
        }

        // Cargar las categorías
        const categories = await category.findAll({ order: [['name', 'ASC']], raw: true });

        response.render('product/edit', {
            product: product_data,
            categories // ahora la vista recibe categories
        });
    } catch (error) {
        console.log("Error al obtener el registro", error.message);
        request.flash("error_msg", "Ocurrió un error al obtener el producto");
        return response.redirect("/product/list");
    }
};

// ------------------ Controlador para actualizar los datos en la bd ------------------
module.exports.update_product = async (request, response) => {
    const errors = validationResult(request);
    const product_id = request.params.product_id;

    if (!errors.isEmpty()) {
        // Mostrar la vista de edición con errores
        return response.render('product/edit', {
            errors: errors.array(),
            product: { 
                product_id,
                name: request.body.name, 
                price: request.body.price, 
                stock: request.body.stock, 
                minimum_stock: request.body.minimum_stock, 
                image: request.body.image 
            }
        });
    }

    try {
        const {name, price, stock, minimum_stock} = request.body;

        // convierte category a int, porque sequelize lo recibe como string
        const category_int = request.body.category ? parseInt(request.body.category) : null;

        // si multer subió la imagen, la guarda, sino se mantiene la actual
        const image = request.file ? request.file.filename : undefined;

        // arma el objeto con los campos a actualizar
        const updateData = { name, price, stock, minimum_stock, category: category_int };
        if (image) updateData.image = image; // solo actualizar si hay nueva imagen

        // actualiza el registro en la bd
        await product.update(updateData, { where: { product_id } });

        request.flash('success_msg', 'El producto se actualizó con éxito');
        response.redirect('/product/list');
    } catch (error) {
        console.error('Error al actualizar el producto', error.message);

        if (error.parent) {
            console.error("Detalle SQL:", error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un error al actualizar el producto');
        response.redirect('/product/list');
    }
};

// ------------------ Controlador de eliminación ------------------
module.exports.delete_product = async (request, response) => {
    try {
        const {product_id} = request.params;
        await product.destroy({where: {product_id: product_id}});

        request.flash('success_msg', 'Categoría eliminada correctamente');
        response.redirect('/product/list');
    } catch (error) {
        console.log('Error al eliminar el producto', error.message);
        request.flash('error_msg', 'Ocurrió un error al eliminar el producto');
        response.redirect('/product/list');
    }
};


// ****************** CONTROLADORES JSON ******************

// ------------------ Listar productos JSON ------------------

module.exports.list_products_json = async (req, res) => {
    try {
        const products = await product.findAll({ raw: true });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.create_product_json = async (data) => {
    try {
        const { name, price, stock, minimum_stock, category } = data;

        // Convertimos category a entero solo si existe, sino lo dejamos null
        const category_int = category ? parseInt(category) : null;

        // Creamos el producto
        const newProduct = await product.create({
            name,
            price,
            stock,
            minimum_stock,
            category: category_int,
            image: null // Para JSON no manejamos imagen, o puedes adaptarlo
        });

        return newProduct; // Devuelve el objeto creado
    } catch (error) {
        // Lanzamos el error para que el router lo capture y devuelva 400
        throw new Error(error.message);
    }
};

module.exports.update_product_json = async (req, res) => {
    try {
        const product_id = req.params.product_id;
        const { name, price, stock, minimum_stock, category } = req.body;
        await product.update({ name, price, stock, minimum_stock, category }, { where: { product_id } });
        res.status(200).json({ message: 'Producto actualizado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.delete_product_json = async (req, res) => {
    try {
        const product_id = req.params.product_id;
        await product.destroy({ where: { product_id } });
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};