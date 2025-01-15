import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import config from '../config/db.js';

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

// Initialize models function
const initializeModels = async () => {
  const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== path.basename(__filename));

  // Dynamically import and add models to db
  for (const file of files) {
    const model = await import(path.join(__dirname, file));
    const modelName = model.default.name;
    db[modelName] = model.default;
  }

  // Associate models if necessary
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
};

// Initialize models and then export db
const startApp = async () => {
  try {
    await initializeModels();
    console.log("Models initialized successfully");
    // Export db object only after models are initialized
  } catch (error) {
    console.error("Error during model initialization:", error);
    process.exit(1);
  }
};

// Start the app and initialize models
startApp();

// Export db object after models are initialized
export { db };
