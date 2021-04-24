const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "email-selections",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            selectionHash: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING(100)
            },
            publicKey: {
                allowNull: false,
                type: DataTypes.STRING(255)
            },
            encryptionKey: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            encryptedUrl: {
                defaultValue: null,
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
                    name: "emailSelections_publicKey_index",
                    using: "BTREE",
                    fields: ["publicKey"]
                },
                {
                    name: "emailSelections_encryptionKey_index",
                    using: "BTREE",
                    fields: ["encryptionKey"]
                }
            ]
        }
    );
};
