'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  product.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    price: {
      type: DataTypes.FLOAT
    },
    reorderLevel: {
      type: DataTypes.STRING
    },
    qty: {
      type: DataTypes.INTEGER
    },
    size: {
      type: DataTypes.STRING
    },
    isImported: {
      type : DataTypes.BOOLEAN,
      defaultValue: false
    },
    catID: { 
      type: DataTypes.INTEGER, 
      references: {
        model: "categories",
        key: "id",
      }
    },
  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};