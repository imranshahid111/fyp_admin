const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    bookingId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    paymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    disputeStatus: {
        type: DataTypes.ENUM('none', 'raised', 'resolved'),
        defaultValue: 'none',
    },
});

module.exports = Payment;
