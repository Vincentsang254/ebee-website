
import pkg from 'sequelize';
import { sequelize } from './index.js';

const { DataTypes } = pkg;

  const Images = sequelize.define("Images", {
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  });

  export default Images
