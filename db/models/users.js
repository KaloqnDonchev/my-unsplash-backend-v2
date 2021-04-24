const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "users",
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
            rootFolderId: {
                defaultValue: null,
                type: DataTypes.STRING(50)
            },
            publicKey: {
                defaultValue: null,
                type: DataTypes.STRING(255)
            },
            encryptionKey: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            firebase: {
                defaultValue: null,
                type: DataTypes.STRING(255)
            },
            rtnTokenHash: {
                defaultValue: null,
                type: DataTypes.STRING(100)
            },
            lastChallenge: {
                defaultValue: null,
                type: DataTypes.STRING(100)
            },
            lastChallengeSignature: {
                defaultValue: null,
                type: DataTypes.STRING(255)
            },
            lastLoggedDevice: {
                allowNull: false,
                defaultValue: "unknown",
                type: DataTypes.STRING(50)
            },
            VATpercentage10000: {
                allowNull: false,
                type: DataTypes.INTEGER.UNSIGNED
            },
            tokenBalance100: {
                allowNull: false,
                defaultValue: 0,
                type: DataTypes.INTEGER
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
                    name: "users_rootFolderId_index",
                    using: "BTREE",
                    fields: ["rootFolderId"]
                },
                {
                    name: "users_publicKey_index",
                    using: "BTREE",
                    fields: ["publicKey"]
                },
                {
                    name: "users_encryptionKey_index",
                    using: "BTREE",
                    fields: ["encryptionKey"]
                },
                {
                    name: "users_firebase_index",
                    using: "BTREE",
                    fields: ["firebase"]
                },
                {
                    name: "users_rtnTokenHash_index",
                    using: "BTREE",
                    fields: ["rtnTokenHash"]
                },
                {
                    name: "users_lastChallenge_index",
                    using: "BTREE",
                    fields: ["lastChallenge"]
                },
                {
                    name: "users_lastChallengeSignature_index",
                    using: "BTREE",
                    fields: ["lastChallengeSignature"]
                },
                {
                    name: "users_lastLoggedDevice_index",
                    using: "BTREE",
                    fields: ["lastLoggedDevice"]
                },
                {
                    name: "users_VATpercentage10000_index",
                    using: "BTREE",
                    fields: ["VATpercentage10000"]
                },
                {
                    name: "users_tokenBalance100_index",
                    using: "BTREE",
                    fields: ["tokenBalance100"]
                }
            ]
        }
    );
};
