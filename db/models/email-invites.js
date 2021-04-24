const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "email-invites",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            userChainId: {
                allowNull: false,
                type: DataTypes.STRING(255)
            },
            inviterName: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            queryHash: {
                defaultValue: null,
                type: DataTypes.STRING(100)
            },
            recipientEmailHash: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            recipientChainId: {
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
                    name: "emailInvites_userChainId_index",
                    using: "BTREE",
                    fields: ["userChainId"]
                },
                {
                    name: "emailInvites_inviterName_index",
                    using: "BTREE",
                    fields: ["inviterName"]
                },
                {
                    name: "emailInvites_queryHash_index",
                    using: "BTREE",
                    fields: ["queryHash"]
                },
                {
                    name: "emailInvites_recipientEmailHash_index",
                    using: "BTREE",
                    fields: ["recipientEmailHash"]
                },
                {
                    name: "emailInvites_recipientChainId_index",
                    using: "BTREE",
                    fields: ["recipientChainId"]
                }
            ]
        }
    );
};
