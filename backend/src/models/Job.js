const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    truckOwnerId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    truckOwnerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    driverId: {
        type: DataTypes.STRING,
    },
    driverName: {
        type: DataTypes.STRING,
    },
    pickupLocation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deliveryLocation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    truckType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    requestedDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'assigned', 'in-progress', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    fare: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    distance: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

module.exports = Job;
