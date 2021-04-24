const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "data-categories",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            dataChainId: {
                allowNull: false,
                type: DataTypes.STRING(100)
            },
            userChainId: {
                defaultValue: null,
                type: DataTypes.STRING(100),
                validate: {
                    oneNotNull() {
                        if (this.userChainId === null && this.userEmail === null) {
                            throw new Error("The id or email of the user should be inserted");
                        }
                    }
                }
            },
            userEmail: {
                defaultValue: null,
                type: DataTypes.STRING(255),
                validate: {
                    oneNotNull() {
                        if (this.userChainId === null && this.userEmail === null) {
                            throw new Error("The id or email of the user should be inserted");
                        }
                    }
                }
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
                    name: "dataCategories_dataChainId_index",
                    using: "BTREE",
                    fields: ["dataChainId"]
                },
                {
                    name: "dataCategories_userChainId_index",
                    using: "BTREE",
                    fields: ["userChainId"]
                },
                {
                    name: "dataCategories_userEmail_index",
                    using: "BTREE",
                    fields: ["userEmail"]
                },
                {
                    name: "dataCategories_category_index",
                    using: "BTREE",
                    fields: ["category"]
                },
                {
                    name: "dataCategories_keywords_index",
                    using: "BTREE",
                    fields: ["keywords"]
                }
            ]
        }
    );
};
