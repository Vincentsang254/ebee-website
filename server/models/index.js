// index.js

import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import { fileURLToPath } from "url";
import config from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";
const sequelizeConfig = config[env];

const db = {};

// Initialize Sequelize connection
let sequelize;
if (sequelizeConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[sequelizeConfig.use_env_variable], sequelizeConfig);
} else {
  sequelize = new Sequelize(
    sequelizeConfig.database,
    sequelizeConfig.username,
    sequelizeConfig.password,
    sequelizeConfig
  );
}

// Dynamically import and initialize models
const files = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 &&
    file !== path.basename(__filename) &&
    file.slice(-3) === ".js" &&
    file.indexOf(".test.js") === -1
  );
});

for (const file of files) {
  const model = await import(path.join(__dirname, file));
  const modelInstance = model.default(sequelize, Sequelize.DataTypes);
  db[modelInstance.name] = modelInstance;
}

// Set up associations (if any)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export sequelize and db
export { sequelize, db };
