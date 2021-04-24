const { DataTypes } = require("sequelize");
const { transferTypes } = require("../../utils").constants;

module.exports = (sequelize) => {
    sequelize.define(
        "payments",
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
            tokens100: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            priceEURperTokenExclVAT100: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            VATpercentage10000: {
                allowNull: false,
                type: DataTypes.INTEGER.UNSIGNED
            },
            transferType: {
                allowNull: false,
                type: DataTypes.ENUM(transferTypes),
                validate: {
                    isIn: {
                        args: [transferTypes],
                        msg: "Invalid type of transfer"
                    }
                }
            },
            emailInvitesId: {
                allowNull: false,
                defaultValue: 0,
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
                    name: "payments_userChainId_index",
                    using: "BTREE",
                    fields: ["userChainId"]
                },
                {
                    name: "payments_tokens100_index",
                    using: "BTREE",
                    fields: ["tokens100"]
                },
                {
                    name: "payments_priceEURperTokenExclVAT100_index",
                    using: "BTREE",
                    fields: ["priceEURperTokenExclVAT100"]
                },
                {
                    name: "payments_VATpercentage10000",
                    using: "BTREE",
                    fields: ["VATpercentage10000"]
                },
                {
                    name: "payments_transferType_index",
                    using: "BTREE",
                    fields: ["transferType"]
                },
                {
                    name: "payments_emailInvitesId_index",
                    using: "BTREE",
                    fields: ["emailInvitesId"]
                }
            ]
        }
    );
};
