const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "rtn-token-cb",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            challenge: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING(100)
            },
            returnChallenge: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            returnUrl: {
                allowNull: false,
                type: DataTypes.STRING(2000)
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        },
        {
            indexes: [
                {
                    name: "rtnTokenCb_returnChallenge_index",
                    using: "BTREE",
                    fields: ["returnChallenge"]
                }
            ]
        }
    );
};
