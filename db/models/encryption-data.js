const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("encryption-data", {
        id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: DataTypes.INTEGER.UNSIGNED
        },
        dataChainId: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING(100)
        },
        dataOriginalHash: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING(100)
        },
        syncPassSalt: {
            allowNull: false,
            unique: true,
            type: DataTypes.STRING(100)
        },
        syncPassHash: {
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
