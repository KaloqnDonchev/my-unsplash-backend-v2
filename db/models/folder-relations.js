const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "folder-relations",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            parentFolderId: {
                allowNull: false,
                type: DataTypes.STRING(50)
            },
            childFolderId: {
                allowNull: false,
                type: DataTypes.STRING(50)
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
                    name: "folderRelations_parentFolderId_index",
                    using: "BTREE",
                    fields: ["parentFolderId"]
                },
                {
                    name: "folderRelations_childFolderId_index",
                    using: "BTREE",
                    fields: ["childFolderId"]
                }
            ]
        }
    );
};
