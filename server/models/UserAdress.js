/** @format */
module.exports = (sequelize, DataTypes) => {
  const UserAddress = sequelize.define("UserAddress", {
    county: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  });

  UserAddress.associate = (models) => {
    UserAddress.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
      onDelete: "cascade",
    });
  };

  return UserAddress;
};
