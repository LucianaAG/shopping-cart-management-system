const cart = require('./cart');
const cart_items = require('./cart_items');
const product = require('./product');
const user = require('./user');

// Cada cart pertenece a un user
cart.belongsTo(user, { foreignKey: 'user_id', as: 'user' });

// Cada cart tiene muchos cart_items
cart.hasMany(cart_items, { foreignKey: 'cart_id', as: 'items' });

// Cada cart_items pertenece a un carrito
cart_items.belongsTo(cart, { foreignKey: 'cart_id', as: 'cart' });

// Cada cart_item pertenece a un product
cart_items.belongsTo(product, { foreignKey: 'product_id', as: 'product' });

module.exports = {
    cart,
    cart_items,
    product,
    user
};