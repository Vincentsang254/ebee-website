import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Products = sequelize.define('Products', {
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // Two decimal places
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
});

Products.associate = (models) => {
  Products.belongsTo(models.Users, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE',
  });

  Products.hasMany(models.Ratings, {
    foreignKey: 'productId',
    as: 'ratings',
    onDelete: 'CASCADE',
  });

  Products.hasMany(models.Carts, {
    foreignKey: 'productId',
    as: 'carts',
    onDelete: 'CASCADE',
  });
};

export default Products;
