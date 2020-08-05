'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pr_master extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        pr_master.hasMany(models.pr_detail,{foreignKey:'prId'});
    }
  };
  pr_master.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    grnId: {
      type: DataTypes.INTEGER, 
      references: {
        model: "grn_masters",
        key: "id",
      }
    },
  }, {
    sequelize,
    modelName: 'pr_master',
  });
  return pr_master;
};