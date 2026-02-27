const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Settings = sequelize.define('Settings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    truckTypes: {
        type: DataTypes.TEXT, // Stored as JSON string
        get() {
            const val = this.getDataValue('truckTypes');
            return val ? JSON.parse(val) : [];
        },
        set(val) {
            this.setDataValue('truckTypes', JSON.stringify(val));
        },
    },
    jobCategories: {
        type: DataTypes.TEXT, // Stored as JSON string
        get() {
            const val = this.getDataValue('jobCategories');
            return val ? JSON.parse(val) : [];
        },
        set(val) {
            this.setDataValue('jobCategories', JSON.stringify(val));
        },
    },
    defaultFareMultiplier: {
        type: DataTypes.FLOAT,
        defaultValue: 1.0,
    },
    platformCommission: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    supportEmail: {
        type: DataTypes.STRING,
    },
    supportPhone: {
        type: DataTypes.STRING,
    },
});

module.exports = Settings;
