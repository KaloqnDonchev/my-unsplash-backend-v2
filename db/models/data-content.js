const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "data-content",
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
            chunkHash: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            chunksCount: {
                allowNull: false,
                type: DataTypes.SMALLINT.UNSIGNED
            },
            dataChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            dataEncryptedContent: {
                allowNull: false,
                type: DataTypes.TEXT("medium")
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
                    name: "dataContent_chunkId_index",
                    using: "BTREE",
                    fields: ["chunkId"]
                },
                {
                    name: "dataContent_chunkHash_index",
                    using: "BTREE",
                    fields: ["chunkHash"]
                },
                {
                    name: "dataContent_chunksCount_index",
                    using: "BTREE",
                    fields: ["chunksCount"]
                },
                {
                    name: "dataContent_dataChainId_index",
                    using: "BTREE",
                    fields: ["dataChainId"]
                }
            ]
        }
    );
};
