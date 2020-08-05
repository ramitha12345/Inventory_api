const moment = require("moment");
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    gender: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastSeen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    nic: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING
    },
    lastSeenDate: {
      type: DataTypes.VIRTUAL,
      get() {
        const t = moment(this.getDataValue('lastSeen')).format('YYYY-MM-DD hh:mm:ss A');
        return t;
      },
    },
    g: {
      type: DataTypes.VIRTUAL,
      get() {
        if (this.getDataValue('gender')) {
          return "Male"
        } else {
          return "Female"
        }
      },
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};