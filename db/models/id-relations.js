const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("id-relations", {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: DataTypes.INTEGER.UNSIGNED
        },
        externalId: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING(100)
        },
        dataChainId: {
            allowNull: false,
            unique: true,
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
    });
};
