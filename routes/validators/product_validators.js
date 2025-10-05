const {body} = require('express-validator');
const category = require('../../models/product');

// reglas para el campo name
const name_validations = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('El campo name es obligatorio')
    .isString()
    .withMessage('El campo name debe ser un una cadena de carácteres')
    .isLength({min: 3})
    .withMessage('El campo name debe tener al menos 3 carácteres')
    .isLength({max: 100})
    .withMessage('Solo se permite un maximo de 100 caracteres para el campo name')
];

// reglas para el campo price
const price_validations = [
    body('price')
    .trim()
    .notEmpty()
    .withMessage('El campo precio es obligatorio')
    .isInt({min: 1})
    .withMessage('El campo precio debe ser un número entero positivo mayor a cero')
];

// reglas para el campo minimum_stock
const minimum_stock_validations = [
    body('minimum_stock')
    .trim()
    .notEmpty()
    .withMessage('El campo stock minimo es obligatorio')
    .isInt({min: 1})
    .withMessage('El campo stock minimo debe ser un número entero positivo mayor a cero')
    .custom((value, {req}) => {
        if (value > parseInt(req.body.stock, 10)) {
            throw new Error('El campo stock minimo no puede ser mayor al campo stock');
        }
        return true;
    })
];

// reglas para el campo stock
const stock_validations = [
    body('stock')
    .trim()
    .notEmpty()
    .withMessage('El campo stock es obligatorio')
    .isInt({min: 1})
    .withMessage('El campo stock debe ser un número entero positivo mayor a cero'),
];

const product_validations = [
    ...name_validations,
    ...price_validations,
    ...minimum_stock_validations,
    ...stock_validations
];

module.exports = {
    product_validations
}