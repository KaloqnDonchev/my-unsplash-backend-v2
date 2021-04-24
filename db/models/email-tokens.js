const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "email-tokens",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            chunkId: {
                allowNull: false,
                type: DataTypes.INTEGER.UNSIGNED
            },
            dataChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            emailTokenHash: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            expirationDate: {
                allowNull: false,
                type: DataTypes.DATE
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
                    name: "emailTokens_chunkId_index",
                    using: "BTREE",
                    fields: ["chunkId"]
                },
                {
                    name: "emailTokens_dataChainId_index",
                    using: "BTREE",
                    fields: ["dataChainId"]
                },
                {
                    name: "emailTokens_emailTokenHash_index",
                    using: "BTREE",
                    fields: ["emailTokenHash"]
                }
            ]
        }
    );
};
