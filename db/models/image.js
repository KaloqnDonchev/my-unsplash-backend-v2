const { DataTypes } = require("sequelize");
const imageMimeTypes = require("../../utils/constants.js");

module.exports = (sequelize) => {
    sequelize.define(
        "images",
        {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: DataTypes.INTEGER
            },
            label: {
                allowNull: false,
                type: DataTypes.STRING(100),
                validate: {
                    is: {
                        args: /^[a-zA-Z0-9\s.,\-&]{1,100}$/,
                        msg: "Label should be 1-100 latin characters long."
                    }
                }
            },
            type: {
                allowNull: false,
                type: DataTypes.STRING(25),
                validate: {
                    isIn: {
                        args: [imageMimeTypes],
                        msg: "Invalid image media type.",
                    },
                },
            },
            sizeBytes: {
                allowNull: false,
                type: DataTypes.INTEGER.UNSIGNED,
                validate: {
                    min: {
                        args: 1,
                        msg: "The size of the image should be a positive number.",
                    },
                },
            },
            data: {
                allowNull: false,
                type: DataTypes.BLOB("long")
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
                    name: "images_type_index",
                    using: "BTREE",
                    fields: ["type"]
                },
            ]
        }
    );
};
