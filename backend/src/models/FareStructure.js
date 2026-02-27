const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FareStructure = sequelize.define('FareStructure', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    truckType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    minFare: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    maxFare: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    perKmRate: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    basePrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

module.exports = FareStructure;
