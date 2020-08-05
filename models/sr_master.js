'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sr_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      sr_master.hasMany(models.sr_detail,{foreignKey:'srId'});
    }
  };
  sr_master.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: "invoice_masters",
        key: "id",
      }
    },
  }, {
    sequelize,
    modelName: 'sr_master',
  });
  return sr_master;
};