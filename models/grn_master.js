const moment = require("moment");
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class grn_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // forign key eka may table eke tiyenawanam belong to
      grn_master.belongsTo(models.customer,{foreignKey:'supplierId'}),
      grn_master.hasMany(models.grn_detail,{foreignKey:'grnId'});
    }
  };
  grn_master.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    supplierId: {
      type: DataTypes.INTEGER, 
      references: {
        model: "customers",
        key: "id",
      }
    },
    isReturn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdDate: {
      type: DataTypes.VIRTUAL,
      get() {
        const date = moment(this.getDataValue('createdAt')).format('YYYY-MM-DD');
        return date;
      },
    },
    purchaseReturned: {
      type: DataTypes.VIRTUAL,
      get() {
        const name = `${this.getDataValue('isReturn') === true ? 'Returned' : 'No'}`;
        return name;
      },
    },
  }, {
    sequelize,
    modelName: 'grn_master',
  });
  return grn_master;
};