const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "data-content-temp",
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
            userChainId: {
                allowNull: false,
                type: DataTypes.STRING(255)
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
                    name: "dataContentTemp_chunkId_index",
                    using: "BTREE",
                    fields: ["chunkId"]
                },
                {
                    name: "dataContentTemp_chunkHash_index",
                    using: "BTREE",
                    fields: ["chunkHash"]
                },
                {
                    name: "dataContentTemp_chunksCount_index",
                    using: "BTREE",
                    fields: ["chunksCount"]
                },
                {
                    name: "dataContentTemp_dataChainId_index",
                    using: "BTREE",
                    fields: ["dataChainId"]
                },
                {
                    name: "dataContentTemp_userChainId_index",
                    using: "BTREE",
                    fields: ["userChainId"]
                }
            ]
        }
    );
};
