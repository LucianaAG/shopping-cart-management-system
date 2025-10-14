const category = require('../models/category');
const {validationResult} = require('express-validator'); 


// ------------------ Controlador de renderizado ------------------
module.exports.render_category_form = (request, response) => {
    response.render('category/create');
}

// ------------------ Controlador de registro ------------------
module.exports.create_category = async (request, response) => {
    // validaciones para la lógica de negocio
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.render('category/create', {
            errors: errors.array(),
            category: { name: request.body?.name || '' }
        });
    }

    
    try {
        const { name } = request.body;
        await category.create({ name });
        request.flash("success_msg", "El registro se efectuó con exito");
        response.redirect("/category/create");
        
    } catch (error) {
        console.error("Error al crear categoría:", error.message);
        if (error.parent) {
            console.error("Detalle SQL:", error.parent.sqlMessage);
        }
        request.flash("error_msg", "Ocurrió un error al crear la categoría");
        response.redirect("/category/create");
    }
};

// ------------------ Controlador de listado ------------------
module.exports.list_categories = async (request, response) => {

    try{
        const categories = await category.findAll({raw: true}); // sequelize obtiene cada registro de la bd
        response.render("category/list", {categories: categories}); // se renderiza la lista con los registros extraidos
    } catch (error) {
        console.log("Error al obtener las categorias", error.message);
        request.flash("error_msg", "Ocurrió un error al obtener las categorías");
        response.redirect("/home");
    }
};

// ------------------ Controlador de modificación ------------------
// muestra el formulario de edición con los datos existentes
module.exports.render_edit_form = async (request, response) => {
    try {
        const category_id = request.params.category_id;
        const category_data = await category.findByPk(category_id, { raw: true });

        if (!category_data) {
            request.flash("error_msg", "No se ha encontrado el registro");
            return response.redirect("/category/list");
        }

        // Renderiza la vista con los datos del registro
        response.render("category/edit", { category: category_data });

    } catch (error) {
        console.log("Error al obtener el registro", error.message);
        request.flash("error_msg", "Ocurrió un error al obtener la categoría");
        return response.redirect("/category/list");
    }
};
// ------------------ Controlador para actualizar los datos en la bd ------------------
module.exports.update_category = async (request, response) => {

    const errors = validationResult(request);
    const category_id = request.params.category_id;

    if (!errors.isEmpty()) {
        // Mostrar la vista de edición con errores
        return response.render('category/edit', {
            errors: errors.array(),
            category: { category_id, name: request.body.name}
        });
    }

    try {
        const category_id = request.params.category_id;
        const {name} = request.body;
        const category_to_update = await category.findByPk(category_id);

        if (!category_to_update) {
            request.flash("success_msg", "Categoría no encontrada");
            return response.redirect("/category/list");
        }
        
        await category_to_update.update({name});
        request.flash("success_msg", "Categoría actualizada correctamente");
        return response.redirect("/category/list");

    } catch (error) {
        console.log("Error al actualizar la categoría", error.message);
        request.flash("error_msg", "Ocurrió un error al actualizar la categoría");
        return response.redirect("/category/list");
    }
}

// ------------------ Controlador de eliminación ------------------
module.exports.delete_category = async (request, response) => {
    try {
        const {category_id} = request.params;
        await category.destroy({ where: {category_id: category_id}});

        request.flash("success_msg", "Categoría eliminada correctamente");
        response.redirect("/category/list");
    } catch (error) {
        console.log("Error al eliminar categoría", error.message);
        request.flash("error_msg", "Ocurrió un error al eliminar la categoría");
        response.redirect("/category/list");
    }
}