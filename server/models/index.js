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

const initializeModels = async () => {
  const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== path.basename(__filename));

  for (const file of files) {
    const model = await import(path.join(__dirname, file));
    const modelName = model.default.name; // assuming model is exported as default
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

// Run the initialization
const startApp = async () => {
  try {
    await initializeModels();
    console.log("Models initialized successfully");
  } catch (error) {
    console.error("Error during model initialization:", error);
    process.exit(1);
  }
};

// Start the app
startApp();

// Correctly export the db object after it's initialized
export { db };
