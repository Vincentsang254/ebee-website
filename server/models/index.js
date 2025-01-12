import fs from 'fs';
import path from 'path';
import pkg from 'sequelize';
import process from 'process';
import { fileURLToPath } from 'url';
import config from '../config/db.js';

const { Sequelize, DataTypes } = pkg;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log the directory to check if it's correct
console.log(`Current directory: ${__dirname}`);

// Get the current environment or default to 'development'
const env = process.env.NODE_ENV || 'development';
const sequelizeConfig = config[env];

// Handle missing configuration
if (!sequelizeConfig) {
  throw new Error(`Configuration for environment ${env} not found`);
}

// Create the Sequelize instance
export const sequelize = new Sequelize(sequelizeConfig.database, sequelizeConfig.username, sequelizeConfig.password, {
  host: sequelizeConfig.host,
  dialect: sequelizeConfig.dialect,
  port: sequelizeConfig.port,
});

const db = {};

// Synchronously load and initialize all models
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file)).default;
    db[model.name] = model(sequelize, DataTypes);
  });

// Set up associations after all models have been loaded
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the Sequelize instance and the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
