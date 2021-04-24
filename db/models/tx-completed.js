const { DataTypes } = require("sequelize");
const { nullDate } = require("../../utils/constants.js");

module.exports = (sequelize) => {
    sequelize.define(
        "tx-completed",
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
                type: DataTypes.TINYINT.UNSIGNED
            },
            executorChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            contractChaindId: {
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
                defaultValue: nullDate
            },
            txAttempts: {
                allowNull: false,
                type: DataTypes.TINYINT.UNSIGNED
            },
            txAttemptTimestamp: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: nullDate
            },
            txStatus: {
                allowNull: false,
                type: DataTypes.TINYINT.UNSIGNED
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: nullDate
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: nullDate
            }
        },
        {
            indexes: [
                {
                    name: "txCompleted_dataChainId_index",
                    using: "BTREE",
                    fields: ["dataChainId"]
                },
                {
                    name: "txCompleted_userChainId_index",
                    using: "BTREE",
                    fields: ["userChainId"]
                },
                {
                    name: "txCompleted_userEmail_index",
                    using: "BTREE",
                    fields: ["userEmail"]
                },
                {
                    name: "txCompleted_recipientChainId_index",
                    using: "BTREE",
                    fields: ["recipientChainId"]
                },
                {
                    name: "txCompleted_recipientEmail_index",
                    using: "BTREE",
                    fields: ["recipientEmail"]
                },
                {
                    name: "txCompleted_requestId_index",
                    using: "BTREE",
                    fields: ["requestId"]
                },
                {
                    name: "txCompleted_requestType_index",
                    using: "BTREE",
                    fields: ["requestType"]
                },
                {
                    name: "txCompleted_trailHash_index",
                    using: "BTREE",
                    fields: ["trailHash"]
                },
                {
                    name: "txManager_trailHashSignature_index",
                    using: "BTREE",
                    fields: ["trailHashSignature"]
                },
                {
                    name: "txCompleted_trailHashSigHash_index",
                    using: "BTREE",
                    fields: ["trailHashSigHash"]
                },
                {
                    name: "txCompleted_network_index",
                    using: "BTREE",
                    fields: ["network"]
                },
                {
                    name: "txCompleted_executorChainId_index",
                    using: "BTREE",
                    fields: ["executorChainId"]
                },
                {
                    name: "txCompleted_txHash_index",
                    using: "BTREE",
                    fields: ["txHash"]
                },
                {
                    name: "txCompleted_txAttempts_index",
                    using: "BTREE",
                    fields: ["txAttempts"]
                },
                {
                    name: "txCompleted_txStatus_index",
                    using: "BTREE",
                    fields: ["txStatus"]
                }
            ]
        }
    );
};
