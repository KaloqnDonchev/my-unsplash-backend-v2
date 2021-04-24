const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "email-query",
        {
            id: {
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED
            },
            queryHash: {
                allowNull: false,
                unique: true,
                type: DataTypes.STRING(100)
            },
            query: {
                allowNull: false,
                type: DataTypes.STRING(2000)
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
