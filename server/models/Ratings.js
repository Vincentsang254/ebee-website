import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Ratings = sequelize.define('Ratings', {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id',
    },
  },
});

Ratings.associate = (models) => {
  Ratings.belongsTo(models.Users, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'cascade',
  });
  Ratings.belongsTo(models.Products, {
    foreignKey: 'productId',
    as: 'product',
    onDelete: 'cascade',
  });
};

export default Ratings;
