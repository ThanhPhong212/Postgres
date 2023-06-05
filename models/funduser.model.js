"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class FundUser extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    FundUser.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
        },
        {
            sequelize,
            modelName: "FundUser",
            tableName: "fund_users",
            timestamps: false,
        }
    );
    return FundUser;
};
