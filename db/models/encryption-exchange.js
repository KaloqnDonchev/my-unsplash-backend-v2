const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "encryption-exchange",
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
            dataFolderId: {
                defaultValue: null,
                type: DataTypes.STRING(50)
            },
            userChainId: {
                defaultValue: null,
                type: DataTypes.STRING(100),
                validate: {
                    oneNotNull() {
                        if (this.userChainId === null && this.userEmail === null) {
                            throw new Error("The id or email of the user should be inserted");
                        }
                    }
                }
            },
            userEmail: {
                defaultValue: null,
                type: DataTypes.STRING(255),
                validate: {
                    oneNotNull() {
                        if (this.userChainId === null && this.userEmail === null) {
                            throw new Error("The id or email of the user should be inserted");
                        }
                    }
                }
            },
            syncPassA: {
                allowNull: false,
                type: DataTypes.STRING(255)
            },
            pubKeyA: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            pubKeysBInfo: {
                defaultValue: null,
                type: DataTypes.TEXT
            },
            syncPassB: {
                defaultValue: null,
                type: DataTypes.STRING(255)
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
                    name: "encryptionExchange_dataChainId_index",
                    using: "BTREE",
                    fields: ["dataChainId"]
                },
                {
                    name: "encryptionExchange_dataFolderId_index",
                    using: "BTREE",
                    fields: ["dataFolderId"]
                },
                {
                    name: "encryptionExchange_userChainId_index",
                    using: "BTREE",
                    fields: ["userChainId"]
                },
                {
                    name: "encryptionExchange_userEmail_index",
                    using: "BTREE",
                    fields: ["userEmail"]
                },
                {
                    name: "encryptionExchange_syncPassA_index",
                    using: "BTREE",
                    fields: ["syncPassA"]
                },
                {
                    name: "encryptionExchange_pubKeyA_index",
                    using: "BTREE",
                    fields: ["pubKeyA"]
                },
                {
                    name: "encryptionExchange_syncPassB_index",
                    using: "BTREE",
                    fields: ["syncPassB"]
                }
            ]
        }
    );
};
