import pkg from 'sequelize';
import { sequelize } from './index.js';

const { DataTypes } = pkg;

const Users = sequelize.define("Users", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profilePic: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg",
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verificationCodeExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  userType: {
    type: DataTypes.ENUM(
      "Admin",
      "Client",
      "Driver",
      "Finance_manager",
      "Company_manager"
    ),
    allowNull: false,
    defaultValue: "Client",
  },
});

Users.associate = (models) => {
  Users.hasMany(models.Products, {
    foreignKey: "userId",
    as: "products",
    onDelete: "CASCADE",
  });
  Users.hasMany(models.Ratings, {
    foreignKey: "userId",
    as: "ratings",
    onDelete: "CASCADE",
  });
  Users.hasMany(models.Orders, {
    foreignKey: "userId",
    as: "orders",
    onDelete: "CASCADE",
  });
  Users.hasMany(models.UserAddress, {
    foreignKey: "userId",
    as: "addresses",
    onDelete: "CASCADE",
  });
};

export default Users;
