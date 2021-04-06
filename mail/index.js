const fs = require("fs");
const handlebars = require("handlebars");
const nodemailer = require("nodemailer");

const config = require("../config");
const {logger} = require("../logger");


handlebars.registerHelper("ifeq", function (a, b, options) {
    if (a === b) {
        return options.fn(this);
    }
    return options.inverse(this);
});

function getTransporter(connection = config.sendMailService) {
    return nodemailer.createTransport(connection);
}

function loadTemplate(templateName) {
    // Open template file
    const source = fs.readFileSync(
        `${config.projectDirPath}/mail/templates/${templateName}.hbs`,
        "utf8"
    );
    // Create email generator
    return handlebars.compile(source);
}

async function sendEmail(type, to, subject, context = {}, shouldThrowError = true, callback) {
    if (config.isTestRun) {
        return;
    }

    const transporter = getTransporter();
    const template = loadTemplate(type);

    context = {...config.mailGlobalInfo, ...context, recipientEmail: to};

    const mailOptions = {
        to: "support@xchain.biz",
        from: '"xChain" <no-reply@xchain.biz>',
        subject: `xChain | ${subject}`,
        html: template(context)
    };

    let result = null;
    try {
        result = await transporter.sendMail(mailOptions, callback);
        logger.info("Email sent successfully.");
    } catch (error) {
        if (shouldThrowError) {
            logger.error(shouldThrowError, error);

            throw {
                code: 500,
                status: "error",
                message: `Email server error. Please try again later or contact us at ${config.mailGlobalInfo.replyEmail}.`
            };
        } else {
            logger.warn(shouldThrowError, error);
        }
    }

    return result;
}

async function sendEmailAndIgnoreErrors(type, to, subject, context = {}, callback) {
    await sendEmail(type, to, subject, context, false, callback);
}


module.exports = {
    sendEmail,
    sendEmailAndIgnoreErrors
};
