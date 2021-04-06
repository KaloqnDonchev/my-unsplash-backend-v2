;
const fs = require('fs');
const {createLogger, transports, format} = require('winston');
require('winston-daily-rotate-file');

const {logsDirPath, projectDirPath, isTestRun} = require('../config.js');


if (!fs.existsSync(logsDirPath)) {
    fs.mkdirSync(logsDirPath);
}


function customLogFormat() {
    return format.printf((info) => {
        const {level, timestamp, callerName, callerLocation, message, ...args} = info;

        const callerInfo = message["callerInfo"] || {};
        const errorMsg = (message || []).length === 1 ? message[0] : message;
        const dateTime = timestamp.replace('T', ' ').replace('Z', '');
        const extraArgs = Object.keys(args).length > 0 ? JSON.stringify(args, null, 4) : '';
        let logType = level.toLowerCase() === "silly" ? "SEQUELIZE" : level.toUpperCase();

        if (isTestRun) {
            logType = `TEST - ${logType}`;
        }

        return `[${logType}][${dateTime}][${callerInfo.callerLocation}][${callerInfo.callerName}]: ${JSON.stringify(errorMsg, null, 4)} ${extraArgs}`;
    });
}

function fileTransporter(logLevel) {
    let transporter = new (transports.DailyRotateFile)({
        filename: `${["warn", "info", "silly"].includes(logLevel.toLowerCase()) ? "combined" : logLevel}-%DATE%.log`,
        dirname: logsDirPath,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '5m',
        maxFiles: '7d',
        level: logLevel.toLowerCase() === "exception" ? undefined : logLevel,
    });

    transporter.on('rotate', function (oldFilename, newFilename) {
        console.log(oldFilename);
        console.log(newFilename);
    });

    return transporter;
}

function getCallerInfo() {
    let callerName = [];
    let callerLocation = [];
    try {
        let projectDirPathFixed = projectDirPath.replace(/\\/g, '\\/');//fix for windows
        let filterOnlyProjectFilesPathsRegex = new RegExp(`^.*at(.*)\\(?.*${projectDirPathFixed}\/(?!modules|node_modules)(.*\\.js):(\\d*):\\d*\\)?.*$`);

        let stack = new Error().stack;

        let stackErrorsInfo = stack
            .replace(/\\/g, '\/')
            .split("\n")
            .filter((info, index) => index > 2 //first 3 are logger paths
                && filterOnlyProjectFilesPathsRegex.test(info));//dont include paths with node_modules or modules or outside project dir

        let relevantErrorsInfo = stackErrorsInfo
            .map(info => info
                .match(new RegExp(`^.*at(.*)\\(?.*${projectDirPathFixed}\/(.*\\.js):(\\d*):\\d*\\)?.*$`))
                .slice(1))//remove first element which is total match not group
            .filter(info => info.length === 3);//only elements with 3 groups -> function, file, line

        relevantErrorsInfo.forEach(info => {
            callerName.push(info[0].trim());
            callerLocation.push(`${info[1]}:${info[2]}`);
        });
    } catch (ignored) {
        console.log(ignored);
    }

    return {
        callerName: callerName.join(" -> "),
        callerLocation: callerLocation.join(" -> "),
    };
}

const logger = createLogger({
    format: format.combine(
        format.errors({stack: true}),
        format.prettyPrint(),
        format.timestamp(),
        customLogFormat(),
    ),
    transports: [
        fileTransporter("error"),
        fileTransporter("warn"),
        fileTransporter("info"),
        fileTransporter("silly"),
        new transports.Console({format: format.colorize()}),
    ],
    exceptionHandlers: [
        fileTransporter("exception"),
        fileTransporter("silly"),
    ],
    exitOnError: false, // do not exit on handled exceptions
});


module.exports = {
    logger: {
        error: function (...args) {//try-catch on all code
            args.callerInfo = getCallerInfo();
            logger.error(args);
        },
        warn: function (...args) {//manual throw
            args.callerInfo = getCallerInfo();
            logger.warn(args);
        },
        info: function (...args) {//console.log
            args.callerInfo = getCallerInfo();
            logger.info(args);
        },
        sequelize: function (...args) {//sequelize logger
            args.callerInfo = getCallerInfo();
            logger.silly(args);
        },
        clearLogger: () => logger.clear(),
    }
}

// // for cli and npm levels
// error: LeveledLogMethod;
// warn: LeveledLogMethod;
// help: LeveledLogMethod;
// data: LeveledLogMethod;
// info: LeveledLogMethod;
// debug: LeveledLogMethod;
// prompt: LeveledLogMethod;
// http: LeveledLogMethod;
// verbose: LeveledLogMethod;
// input: LeveledLogMethod;
// silly: LeveledLogMethod;
//
// // for syslog levels only
// emerg: LeveledLogMethod;
// alert: LeveledLogMethod;
// crit: LeveledLogMethod;
// warning: LeveledLogMethod;
// notice: LeveledLogMethod;