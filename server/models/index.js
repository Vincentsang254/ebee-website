import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';
import config from '../config/db.js';  // Make sure to import your DB config

// Get the current filename and directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const sequelizeConfig = config[env];

if (!sequelizeConfig) {
  throw new Error(`Configuration for environment ${env} not found`);
}

// Initialize Sequelize instance
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

// Dynamically load models using import instead of require
const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== path.basename(__filename));

for (const file of files) {
  const model = await import(path.join(__dirname, file));
  const modelName = model.default.name; // assuming model is exported as default
  db[modelName] = model.default;
}

// Set up associations after all models are initialized
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // Apply associations
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
