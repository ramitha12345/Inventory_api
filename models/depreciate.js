'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class depreciate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  depreciate.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    productId: {
      type: DataTypes.INTEGER, 
      references: {
        model: "products",
        key: "id",
      }
    },
    qty: {
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'depreciate',
  });
  return depreciate;
};