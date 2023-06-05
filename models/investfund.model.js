'use strict';
const { Model } = require('sequelize');
const { convertDate } = require("../plugins/index");
module.exports = (sequelize, DataTypes) => {
  class InvestFund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, { through: models.FundUser });
    }
  }
  InvestFund.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      investFundName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      expertId: {
        type: DataTypes.INTEGER,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        get() {
          const date = this.getDataValue('createdAt');
          return convertDate(date);
        },
      },
    },
    {
      sequelize,
      modelName: 'InvestFund',
      tableName: 'invest_funds',
      createdAt: false,
    }
  );
  return InvestFund;
};
