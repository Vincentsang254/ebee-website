import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';
import config from '../config/db.js';

// Convert URL to path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log environment and config
const env = process.env.NODE_ENV || 'development';
const sequelizeConfig = config[env];

if (!sequelizeConfig) {
  throw new Error(`Configuration for environment ${env} not found`);
}

// Create Sequelize instance
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

// Synchronously read model files and initialize models
const models = await Promise.all(
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf('.') !== 0 &&
        file !== path.basename(__filename) &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
      );
    })
    .map(async (file) => {
      const model = (await import(path.join(__dirname, file))).default;
      model.init(sequelize, DataTypes);
      db[model.name] = model;
    })
);

// Set up associations after models are initialized
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the db object and Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
