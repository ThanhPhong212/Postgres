"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class StockExchange extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            //   models.User.belongsTo(this, { foreignKey: { name: 'roleId', allowNull: false }});
        }
    }
    StockExchange.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
            },
            code: {
                type: DataTypes.STRING,
                unique: {
                    msg: 'Code must be unique',
                }
            }
        },
        {
            sequelize,
            modelName: "StockExchange",
            tableName: "stock_exchanges",
            timestamps: false,
        }
    );
    return StockExchange;
};
