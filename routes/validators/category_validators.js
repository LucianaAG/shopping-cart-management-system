const {body} = require('express-validator');
const Category = require('../../models/category');

// reglas para el campo name
const name_validations = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('el nombre es obligatorio')
    .isLength({min: 3})
    .withMessage('el nombre debe tener al menos 3 caracteres')
];

// reglas de registro (también valida unicidad en la BD)
const create_category_validations = [
    ...name_validations,
    body('name').custom(async (value) => {
        // revisa la unicidad
        const exists = await Category.findOne({where: {name: value}, raw: true});
        
        if (exists) {
         throw new Error('ya existe una categoría con ese nombre');   
        }
        return true;
    })
];

// reglas para la modificación (permite mantener el mismo nombre y valida la unicidad)
const update_category_validations = [
    ...name_validations,
    body('name').custom(async (value, {req}) => {
        const category_id = req.params.category_id;
        const exists = await Category.findOne({where: {name: value}, raw: true});

        if (exists && String(exists.category_id) !== String(category_id)) {
            throw new Error('ya existe una categoría con ese nombre');
        }
        return true;
    })
];

module.exports = {
    create_category_validations,
    update_category_validations
};