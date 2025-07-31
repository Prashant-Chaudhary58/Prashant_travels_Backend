const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../database/db');

const Property = sequelize.define('Properties', {

    property_id: {
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
        type: DataTypes.STRING, // Changed to STRING temporarily
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
        type: DataTypes.ARRAY(DataTypes.TEXT), // Changed from STRING to TEXT
        defaultValue: [],
        allowNull: true
    },
    
    property_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    facilities: {
        type: DataTypes.JSON, // Changed from ARRAY to JSON for better compatibility
        defaultValue: {},
        allowNull: true
    },

})

module.exports = Property;