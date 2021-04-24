const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "folders",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            dataFolderId: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING(50)
            },
            userChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            folderName: {
                allowNull: false,
                type: DataTypes.STRING(50)
            },
            category: {
                allowNull: false,
                defaultValue: "OTHER",
                type: DataTypes.STRING(30)
            },
            keywords: {
                allowNull: false,
                defaultValue: "",
                type: DataTypes.STRING(100)
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
                    name: "folders_userChainId_index",
                    using: "BTREE",
                    fields: ["userChainId"]
                },
                {
                    name: "folders_folderName_index",
                    using: "BTREE",
                    fields: ["folderName"]
                },
                {
                    name: "folders_category_index",
                    using: "BTREE",
                    fields: ["category"]
                },
                {
                    name: "folders_keywords_index",
                    using: "BTREE",
                    fields: ["keywords"]
                }
            ]
        }
    );
};
