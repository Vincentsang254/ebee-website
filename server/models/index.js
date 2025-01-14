import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';
import config from '../config/db.js';

// Convert URL to path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const sequelizeConfig = config[env];

if (!sequelizeConfig) {
  throw new Error(`Configuration for environment ${env} not found`);
}

export const sequelize = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  {
    host: sequelizeConfig.host,
    dialect: sequelizeConfig.dialect,
    port: sequelizeConfig.port,
  }
);

const db = {};

// Initialize models
db.initializeModels = async () => {
  const modelFiles = fs.readdirSync(__dirname).filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
  );

  // Initialize models and add them to the db object
  for (const file of modelFiles) {
    const model = (await import(path.join(__dirname, file))).default;

    // Ensure that each model calls `init()` correctly with Sequelize instance
    if (model && typeof model.init === 'function') {
      model.init(sequelize, DataTypes); // Ensure passing sequelize and DataTypes to the init function
      db[model.name] = model; // Store the model in the db object
    }
  }

  // Set up associations after models are initialized
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
};

export default db;
