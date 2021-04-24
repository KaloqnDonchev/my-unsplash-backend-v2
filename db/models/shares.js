const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "shares",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            userChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
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
            ownerChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            dataChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            dateFirstAccessed: {
                allowNull: true,
                defaultValue: null,
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
                    name: "shares_userChainId_index",
                    using: "BTREE",
                    fields: ["userChainId"]
                },
                {
                    name: "shares_recipientChainId_index",
                    using: "BTREE",
                    fields: ["recipientChainId"]
                },
                {
                    name: "shares_recipientEmail_index",
                    using: "BTREE",
                    fields: ["recipientEmail"]
                },
                {
                    name: "shares_ownerChainId_index",
                    using: "BTREE",
                    fields: ["ownerChainId"]
                },
                {
                    name: "shares_dataChainId_index",
                    using: "BTREE",
                    fields: ["dataChainId"]
                }
            ]
        }
    );
};
