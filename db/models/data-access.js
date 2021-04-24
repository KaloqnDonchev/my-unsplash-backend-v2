const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "data-access",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
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
            dataChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            chunkId: {
                allowNull: false,
                type: DataTypes.INTEGER.UNSIGNED
            },
            accessInfo: {
                allowNull: false,
                type: DataTypes.TEXT
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
                    name: "dataAccess_userChainId_index",
                    using: "BTREE",
                    fields: ["userChainId"]
                },
                {
                    name: "dataAccess_userEmail_index",
                    using: "BTREE",
                    fields: ["userEmail"]
                },
                {
                    name: "dataAccess_dataChainId_index",
                    using: "BTREE",
                    fields: ["dataChainId"]
                },
                {
                    name: "dataAccess_chunkId_index",
                    using: "BTREE",
                    fields: ["chunkId"]
                }
            ]
        }
    );
};
