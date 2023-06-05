"use strict";
const { Model } = require("sequelize");
const { tinhLai, tinhPhanTramLai } = require('../helper/index');
module.exports = (sequelize, DataTypes) => {
    class StockPortfolio extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.InvestFund.hasMany(this, { foreignKey: { name: 'investFundId' } })
            this.belongsTo(models.InvestFund, { foreignKey: { name: 'investFundId' } });
        }
    }
    StockPortfolio.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            stockCode: {
                type: DataTypes.STRING,
                allowNull: false
            },
            accountNumber: {
                type: DataTypes.STRING,
                allowNull: false
            },
            amount: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            price: {
                type: DataTypes.DOUBLE,
                defaultValue: 0,
            },
            priceCurrent: {
                type: DataTypes.DOUBLE,
                defaultValue: 0,
            },
            margin: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            owe: {
                type: DataTypes.VIRTUAL,
                get() {
                    const amount = this.getDataValue('amount');
                    const price = this.getDataValue('price');
                    const margin = this.getDataValue('margin') / 100;
                    //Sức mua * margin / (1 + margin)
                    return ((amount * price) * margin / (1 + margin));
                },
            },
            palNumber: {
                type: DataTypes.VIRTUAL,
                get() {
                    return tinhLai(this.dataValues);
                },
            },
            palPercent: {
                type: DataTypes.VIRTUAL,
                get() {
                    return tinhPhanTramLai(this.dataValues);
                }
            }
        },
        {
            sequelize,
            modelName: "StockPortfolio",
            tableName: "stock_portfolios",
            indexes: [
                { fields: ['stockCode', 'accountNumber'], name: 'key_unique', unique: true }
            ]
        }
    );
    return StockPortfolio;
};
