const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "tx-manager",
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
            recipientChainId: {
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
            recipientEmail: {
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
            requestId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            requestType: {
                allowNull: false,
                type: DataTypes.TINYINT.UNSIGNED
            },
            requestBody: {
                allowNull: false,
                type: DataTypes.TEXT
            },
            requestBodyHashSig: {
                allowNull: false,
                type: DataTypes.STRING(255)
            },
            trailHash: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            trailHashSignature: {
                allowNull: false,
                type: DataTypes.STRING(255)
            },
            trailHashSigHash: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            extraTrailHashes: {
                allowNull: false,
                type: DataTypes.TEXT
            },
            network: {
                // 0-none; 1-eth; 2-ae;
                allowNull: false,
                defaultValue: 0,
                type: DataTypes.TINYINT.UNSIGNED
            },
            executorChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            contractChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            txHash: {
                defaultValue: null,
                type: DataTypes.STRING(100)
            },
            txReceipt: {
                defaultValue: null,
                type: DataTypes.TEXT
            },
            txReceiptTimestamp: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            txAttempts: {
                allowNull: false,
                defaultValue: 0,
                type: DataTypes.TINYINT.UNSIGNED
            },
            txAttemptTimestamp: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            txStatus: {
                allowNull: false,
                type: DataTypes.TINYINT.UNSIGNED
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
                    name: "txManager_dataChainId_index",
                    using: "BTREE",
                    fields: ["dataChainId"]
                },
                {
                    name: "txManager_userChainId_index",
                    using: "BTREE",
                    fields: ["userChainId"]
                },
                {
                    name: "txManager_userEmail_index",
                    using: "BTREE",
                    fields: ["userEmail"]
                },
                {
                    name: "txManager_recipientChainId_index",
                    using: "BTREE",
                    fields: ["recipientChainId"]
                },
                {
                    name: "txManager_recipientEmail_index",
                    using: "BTREE",
                    fields: ["recipientEmail"]
                },
                {
                    name: "txManager_requestId_index",
                    using: "BTREE",
                    fields: ["requestId"]
                },
                {
                    name: "txManager_requestType_index",
                    using: "BTREE",
                    fields: ["requestType"]
                },
                {
                    name: "txManager_trailHash_index",
                    using: "BTREE",
                    fields: ["trailHash"]
                },
                {
                    name: "txManager_trailHashSignature_index",
                    using: "BTREE",
                    fields: ["trailHashSignature"]
                },
                {
                    name: "txManager_trailHashSigHash_index",
                    using: "BTREE",
                    fields: ["trailHashSigHash"]
                },
                {
                    name: "txManager_network_index",
                    using: "BTREE",
                    fields: ["network"]
                },
                {
                    name: "txManager_executorChainId_index",
                    using: "BTREE",
                    fields: ["executorChainId"]
                },
                {
                    name: "txManager_contractChainId_index",
                    using: "BTREE",
                    fields: ["contractChainId"]
                },
                {
                    name: "txManager_txHash_index",
                    using: "BTREE",
                    fields: ["txHash"]
                },
                {
                    name: "txManager_txAttempts_index",
                    using: "BTREE",
                    fields: ["txAttempts"]
                },
                {
                    name: "txManager_txStatus_index",
                    using: "BTREE",
                    fields: ["txStatus"]
                }
            ]
        }
    );
};
