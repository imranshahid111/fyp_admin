const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    recipient: {
        type: DataTypes.ENUM('all', 'users', 'truck-owners', 'drivers'),
        allowNull: false,
    },
    createdDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('sent', 'draft'),
        defaultValue: 'draft',
    },
});

module.exports = Notification;
