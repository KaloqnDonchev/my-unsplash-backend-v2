module.exports = {
    xChainError: require("./default.js"),
    UserServiceError: require("./user.js").UserServiceError,
    ProjectServiceError: require("./project.js").ProjectServiceError,
    DocumentServiceError: require("./document.js").DocumentServiceError,
    TemplateServiceError: require("./template.js").TemplateServiceError,
    AnalyticsServiceError: require("./analytics.js").AnalyticsServiceError,
};
