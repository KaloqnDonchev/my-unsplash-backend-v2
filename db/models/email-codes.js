const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "email-codes",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            selectionHash: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING(255)
            },
            code: {
                allowNull: false,
                type: DataTypes.MEDIUMINT(6).ZEROFILL.UNSIGNED
            },
            emailMessageId: {
                allowNull: false,
                type: DataTypes.STRING(1000)
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
                    name: "emailCodes_selectionHash_index",
                    using: "BTREE",
                    fields: ["selectionHash"]
                },
                {
                    name: "emailCodes_email_index",
                    using: "BTREE",
                    fields: ["email"]
                },
                {
                    name: "emailCodes_code_index",
                    using: "BTREE",
                    fields: ["code"]
                }
            ]
        }
    );
};
