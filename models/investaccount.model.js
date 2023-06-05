"use strict";
const { Model } = require("sequelize");
const { convertDate } = require("../plugins/index");
module.exports = (sequelize, DataTypes) => {
    class InvestAccount extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.User, { foreignKey: { name: 'userId' } });
            models.StockPortfolio.belongsTo(this, { foreignKey: { name: 'accountNumber' }, targetKey: 'accountNumber' });
            this.hasMany(models.StockPortfolio, { foreignKey: { name: 'accountNumber' }, sourceKey: 'accountNumber' });
            this.belongsTo(models.StockExchange, { foreignKey: { name: 'stockExchangeCode' }, sourceKey: 'stockExchangeCode', targetKey: 'code'});
        }
    }
    InvestAccount.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            accountName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            accountNumber: {
                type: DataTypes.STRING,
                unique: {
                    msg: 'Account number must be unique',
                }
            },
            surplus: {
                type: DataTypes.DOUBLE,
                defaultValue: 0
            },
            surplusFormat: {
                type: DataTypes.VIRTUAL,
                get() {
                    const num = this.getDataValue('surplus');
                    return num/1e9;
                },
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            stockExchangeCode: {
                type: DataTypes.STRING
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
                get() {
                    const date = this.getDataValue('createdAt');
                    return convertDate(date);
                },
            },
            createdBy: {
                type: DataTypes.INTEGER,
            },
            isDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: "InvestAccount",
            tableName: "invest_accounts",
            createdAt: false
        }
    );
    return InvestAccount;
};
