const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "data",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            dataChainId: {
                allowNull: false,
                type: DataTypes.STRING(100),
                unique: true
            },
            ownerChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            dataOriginalHash: {
                allowNull: false,
                type: DataTypes.STRING(100),
                unique: true
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            extension: {
                allowNull: false,
                type: DataTypes.STRING(20)
            },
            sizeBytes: {
                allowNull: false,
                type: DataTypes.BIGINT.UNSIGNED
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
                    name: "data_ownerChainId_index",
                    using: "BTREE",
                    fields: ["ownerChainId"]
                },
                {
                    name: "data_name_index",
                    using: "BTREE",
                    fields: ["name"]
                },
                {
                    name: "data_extension_index",
                    using: "BTREE",
                    fields: ["extension"]
                },
                {
                    name: "data_sizeBytes_index",
                    using: "BTREE",
                    fields: ["sizeBytes"]
                }
            ]
        }
    );
};
