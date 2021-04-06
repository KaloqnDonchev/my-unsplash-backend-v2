function applyDBRelations(sequelize) {
    const {
        users,
        userInfo,
        userAvatars,
        companies,
        addresses,
        userSettings,
        userPreferences,
        projects,
        documents,
        templates,
        templatesHistory,
        templatesSnapshot,
        templatesLeverage,
        templatesPEFund,
        templatesPDFund,
        templatesFoFFund,
        templatesRealFund,
        analytics,
        sizeRanges,
        leverageRanges,
    } = sequelize.models;

    users.hasOne(userInfo, {as: "info", foreignKey: "userId"});
    users.hasOne(userAvatars, {as: "avatar", foreignKey: "userId"});
    users.hasOne(userSettings, {as: "settings", foreignKey: "userId"});
    users.hasOne(userPreferences, {as: "preferences", foreignKey: "userId"});

    //TODO remove?
    users.hasMany(projects, {as: "projects", foreignKey: "userId"});

    userInfo.belongsTo(addresses, {foreignKey: "addressId"});
    userInfo.belongsTo(companies, {foreignKey: "companyId"});

    companies.belongsTo(addresses, {foreignKey: "addressId"});

    projects.belongsTo(users, {foreignKey: "userId"});

    documents.belongsTo(users, {foreignKey: "userId"});
    documents.belongsTo(projects, {foreignKey: "projectId"});

    templates.belongsTo(users, {foreignKey: "userId"});
    templates.belongsTo(projects, {foreignKey: "projectId"});
    templates.belongsTo(documents, {foreignKey: "dataId"});

    templatesHistory.belongsTo(templates, {foreignKey: "templateId"});
    templatesSnapshot.belongsTo(templates, {foreignKey: "templateId"});
    templatesLeverage.belongsTo(templates, {foreignKey: "templateId"});

    templatesPEFund.belongsTo(templates, {foreignKey: "templateId"});
    templatesPDFund.belongsTo(templates, {foreignKey: "templateId"});
    templatesFoFFund.belongsTo(templates, {foreignKey: "templateId"});
    templatesRealFund.belongsTo(templates, {foreignKey: "templateId"});

    templatesPEFund.belongsTo(sizeRanges, {foreignKey: "sizeRangeId"});
    templatesPDFund.belongsTo(sizeRanges, {foreignKey: "sizeRangeId"});
    templatesFoFFund.belongsTo(sizeRanges, {foreignKey: "sizeRangeId"});
    templatesRealFund.belongsTo(sizeRanges, {foreignKey: "sizeRangeId"});

    templatesPEFund.belongsTo(leverageRanges, {foreignKey: "leverageRangeId"});
    templatesPDFund.belongsTo(leverageRanges, {foreignKey: "leverageRangeId"});
    templatesFoFFund.belongsTo(leverageRanges, {foreignKey: "leverageRangeId"});
    templatesRealFund.belongsTo(leverageRanges, {foreignKey: "leverageRangeId"});

    analytics.belongsTo(templates, {foreignKey: "templateId"});
}

module.exports = {applyDBRelations};
