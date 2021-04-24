const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "selections",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            selectionHash: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING(100)
            },
            dataChainIds: {
                allowNull: false,
                type: DataTypes.TEXT
            },
            usersChainIds: {
                defaultValue: null,
                type: DataTypes.TEXT,
                validate: {
                    oneNotNull() {
                        if (this.userChainId === null && this.userEmail === null) {
                            throw new Error("The id or email of the user should be inserted");
                        }
                    }
                }
            },
            usersEmails: {
                defaultValue: null,
                type: DataTypes.TEXT,
                validate: {
                    oneNotNull() {
                        if (this.userChainId === null && this.userEmail === null) {
                            throw new Error("The id or email of the user should be inserted");
                        }
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
            indexes: []
        }
    );
};
