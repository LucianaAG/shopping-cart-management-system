const sequelize = require('sequelize');
const db = require('../database/conexion_mysql_db');
const user = require('./user');


const cart = db.sequelize_connection.define('cart', 
    {
        cart_id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: sequelize.DATEONLY
        },
        state: {
            type: sequelize.STRING(100)
        },
        user_id: {
            type: sequelize.INTEGER,
            allowNull: true,
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }
    }
);

cart.belongsTo(user, {
    foreignKey: 'user_id',
    as: 'user_relation'
});

module.exports = cart;