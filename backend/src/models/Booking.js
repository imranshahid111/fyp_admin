const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    jobId: {
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
        allowNull: false,
    },
    driverName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    fare: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('completed', 'cancelled'),
        allowNull: false,
    },
    route: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    truckType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Booking;
