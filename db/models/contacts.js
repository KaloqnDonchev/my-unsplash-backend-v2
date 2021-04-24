const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "contacts",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            name: {
                type: DataTypes.STRING(100),
                dafaultValue: null
            },
            userChainId: {
                type: DataTypes.STRING(100),
                dafaultValue: null
            },
            email: {
                type: DataTypes.STRING(255),
                dafaultValue: null
            },
            ownerChainId: {
                type: DataTypes.STRING(100),
                allowNull: false
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
                    name: "contacts_name_index",
                    using: "BTREE",
                    fields: ["name"]
                },
                {
                    name: "contacts_userChainId_index",
                    using: "BTREE",
                    fields: ["userChainId"]
                },
                {
                    name: "contacts_email_index",
                    using: "BTREE",
                    fields: ["email"]
                },
                {
                    name: "contacts_ownerChainId_index",
                    using: "BTREE",
                    fields: ["ownerChainId"]
                }
            ]
        }
    );
};
