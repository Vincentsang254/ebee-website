import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Images = sequelize.define('Images', {
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Images;
