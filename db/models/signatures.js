const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "signatures",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            dataChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            userChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
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
                    name: "signatures_dataChainId_index",
                    using: "BTREE",
                    fields: ["dataChainId"]
                },
                {
                    name: "signatures_userChainId_index",
                    using: "BTREE",
                    fields: ["userChainId"]
                }
            ]
        }
    );
};
