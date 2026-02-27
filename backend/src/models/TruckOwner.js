const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TruckOwner = sequelize.define('TruckOwner', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    registrationDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    totalTrucks: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    totalDrivers: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'inactive'),
        defaultValue: 'pending',
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
});

module.exports = TruckOwner;
