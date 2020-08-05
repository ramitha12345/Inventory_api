'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class invoice_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  invoice_detail.init({
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
    price: {
      type: DataTypes.FLOAT
    },
    invoiceId: {
      type: DataTypes.INTEGER, 
      references: {
        model: "invoice_masters",
        key: "id",
      }
    },
  }, {
    sequelize,
    modelName: 'invoice_detail',
  });
  return invoice_detail;
};