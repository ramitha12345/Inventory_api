'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class invoice_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      invoice_master.belongsTo(models.customer,{foreignKey:'customerId'}),
      invoice_master.hasMany(models.invoice_detail,{foreignKey:'invoiceId'});
    }
  };
  invoice_master.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    customerId: {
      type: DataTypes.INTEGER, 
      references: {
        model: "customers",
        key: "id",
      }
    },
    isReturned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'invoice_master',
  });
  return invoice_master;
};