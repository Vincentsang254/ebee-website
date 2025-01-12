import fs from 'fs';
import path from 'path';
import pkg from 'sequelize';
import process from 'process';
import { fileURLToPath } from 'url';
import config from '../config/db.js'; // Ensure correct relative path

const { Sequelize, DataTypes } = pkg;

// Get the current file's URL and convert it to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log the directory to check if it's correct
console.log(`Current directory: ${__dirname}`);

// Log the configuration to ensure it's loaded
const env = process.env.NODE_ENV || 'development'; // Defaults to 'development'
const sequelizeConfig = config[env]; // Get the correct configuration based on NODE_ENV

// Handle missing configuration
if (!sequelizeConfig) {
  throw new Error(`Configuration for environment ${env} not found`);
}

// Create the Sequelize instance using the config for the current environment
const sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
  host: sequelizeConfig.host,
  dialect: sequelizeConfig.dialect,
  port: sequelizeConfig.port,
});

const db = {};

// Reading all model files and dynamically importing them
(async () => {
  const files = fs.readdirSync(__dirname).filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

  for (const file of files) {
    try {
      const module = await import(path.join(__dirname, file));
      const model = module.default(sequelize, DataTypes); // Initialize the model
      db[model.name] = model; // Add the model to the db object
    } catch (err) {
      console.error('Error loading model:', err);
    }
  }

  // Set up associations after all models have been loaded
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db); // Set up associations if they exist
    }
  });

  // Log when models are loaded
  console.log('Models loaded successfully');
})();

// Add Sequelize and Sequelize instance to db for access in other parts of the application
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
