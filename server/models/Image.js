import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

  const Users = sequelize.define("Users", {
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  });

  export default Images
