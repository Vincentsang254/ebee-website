import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import config from '../config/db.js';  // Ensure correct relative path

// Correct way to import Sequelize and DataTypes from sequelize (CommonJS package)
import SequelizePkg from 'sequelize'; 
const { Sequelize, DataTypes } = SequelizePkg;

// Get the current file's URL and convert it to a path
const __filename = fileURLToPath(import.meta.url);  // Fix for ES modules
const __dirname = path.dirname(__filename);  // Fix for __dirname in ES modules

// Log the directory to check if it's correct
console.log(`Current directory: ${__dirname}`);

// Log the configuration to ensure it's loaded
const env = process.env.NODE_ENV || 'development';  // Defaults to 'development'
const sequelizeConfig = config[env];  // Get the correct configuration based on NODE_ENV

// Handle missing configuration
if (!sequelizeConfig) {
  throw new Error(`Configuration for environment ${env} not found`);
}

// Create the Sequelize instance using the config for the current environment
export const sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
  host: sequelizeConfig.host,
  dialect: sequelizeConfig.dialect,
  port: sequelizeConfig.port,
});

const db = {};

// Reading all model files and dynamically importing them
fs.readdirSync(__dirname)  // Correctly using __dirname here
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&       // Exclude hidden files
      file !== path.basename(__filename) && // Exclude the current file
      file.slice(-3) === '.js' &&     // Only JavaScript files
      file.indexOf('.test.js') === -1 // Exclude test files
    );
  })
  .forEach((file) => {
    import(path.join(__dirname, file))  // Dynamically import models
      .then((module) => {
        const model = module.default(sequelize, DataTypes);  // Initialize the model
        db[model.name] = model;  // Add the model to the db object
      })
      .catch((err) => {
        console.error('Error loading model:', err);
      });
});

// Set up associations after all models have been loaded
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);  // Set up associations if they exist
  }
});

// Add Sequelize and Sequelize instance to db for access in other parts of the application
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
