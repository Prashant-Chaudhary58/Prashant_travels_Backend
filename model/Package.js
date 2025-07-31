const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Package = sequelize.define('Packages', {
    package_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    owner_id: { 
        type: DataTypes.STRING, // same as property model
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    image: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: [],
        allowNull: true
    },
    package_type: {    // changed from property_type to package_type
        type: DataTypes.STRING,
        allowNull: false,
    },
    facilities: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: true
    },
});

module.exports = Package;
