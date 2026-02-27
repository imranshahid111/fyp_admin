const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
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
    licenseNumber: {
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
    assignedJobs: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    completedJobs: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('available', 'on-job', 'inactive'),
        defaultValue: 'available',
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
});

module.exports = Driver;
