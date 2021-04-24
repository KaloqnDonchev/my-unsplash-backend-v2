const { DataTypes } = require("sequelize");
const { possibleProductTypes } = require("../../utils").constants;

module.exports = (sequelize) => {
    sequelize.define(
        "products",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING(50)
            },
            priceInToken100: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            type: {
                allowNull: false,
                type: DataTypes.ENUM(possibleProductTypes),
                validate: {
                    isIn: {
                        args: [possibleProductTypes],
                        msg: "Invalid product type"
                    }
                }
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
                    name: "products_name_index",
                    using: "BTREE",
                    fields: ["name"]
                },
                {
                    name: "products_priceInToken100_index",
                    using: "BTREE",
                    fields: ["priceInToken100"]
                },
                {
                    name: "products_type_index",
                    using: "BTREE",
                    fields: ["type"]
                }
            ]
        }
    );
};
