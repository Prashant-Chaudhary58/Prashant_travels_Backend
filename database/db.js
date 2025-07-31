const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'travels_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'your_actual_password',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false, // Set to console.log to see SQL queries
        define: {
            timestamps: true,
            schema: 'public'
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        // Add these options
        dialectOptions: {
            useUTC: false
        },
        timezone: '+05:45' // for Nepal time
    }
);

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', {
            message: err.message,
            code: err.parent?.code,
            detail: err.parent?.detail
        });
    });

module.exports = sequelize;