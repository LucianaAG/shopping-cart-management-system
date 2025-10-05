const sequelize = require('sequelize'); // importa el ORM
const db = require('../database/conexion_mysql_db'); // importa la bd
const category =  require('./category'); // importa el modelo contacto

// definición del modelo
const product = db.sequelize_connection.define('product',
    {
        product_id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: sequelize.STRING(100),
        },
        price: {
            type: sequelize.FLOAT
        },
        stock: {
            type: sequelize.INTEGER
        },
        minimum_stock: {
            type: sequelize.INTEGER
        },
        image: {
            type: sequelize.STRING
        },
        category: { // definición de la relación foranea con 'category'
            type: sequelize.INTEGER,
            allowNull: true,
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }

    }
);

// un producto pertenece a una categoría
product.belongsTo(category, {
    foreignKey: 'category',
    as: 'category_relation'
});

module.exports = product;