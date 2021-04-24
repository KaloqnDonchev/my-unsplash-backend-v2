const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "user-credentials",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            userChainId: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING(100)
            },
            permissions: {
                allowNull: false,
                defaultValue: "nnn",
                type: DataTypes.STRING(50)
            },
            maxFileSizeKB: {
                allowNull: false,
                defaultValue: "5120",
                type: DataTypes.INTEGER.UNSIGNED
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
                    name: "userCredentials_permissions_index",
                    using: "BTREE",
                    fields: ["permissions"]
                },
                {
                    name: "userCredentials_maxFileSizeKB_index",
                    using: "BTREE",
                    fields: ["maxFileSizeKB"]
                }
            ]
        }
    );
};
