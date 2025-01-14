import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const Carts = sequelize.define('Carts', {
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
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});

// Associations should be defined after the model is initialized
Carts.associate = (models) => {
  Carts.belongsTo(models.Users, {
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'cascade',
  });

  Carts.belongsTo(models.Products, {
    foreignKey: 'productId',
    as: 'product',
    onDelete: 'cascade',
  });
};

export default Carts;
