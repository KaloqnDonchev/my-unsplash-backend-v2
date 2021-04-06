;
const fs = require("fs");
const csv = require("csvtojson");

const {isNullAny} = require("../../../utils");


async function filterAnalyticsData() {
    let analyticsDataTypesUses = {};
    let bigFilename = `${__dirname}/xchain_public_analytics-big.csv`;
    let filteredFilename = bigFilename.replace("-big", "");

    if (fs.existsSync(bigFilename) && fs.existsSync(filteredFilename)) {
        return;
    }

    if (!fs.existsSync(bigFilename)) {
        fs.renameSync(filteredFilename, bigFilename);
    }

    return csv({
        ignoreEmpty: true,
        colParser: {
            period: "number",
            dataPointForPeriod: "number",
            value: "number",
        },
    })
        .fromFile(bigFilename)
        .then(async (array) => {
            let headers = await getFirstLine(bigFilename);
            let columns = headers.split(",");
            let filteredArray = [headers];
            let idCounter = 1;

            array.forEach((row) => {
                if (!isNullAny(analyticsDataTypesUses[row.fundId])
                    && !isNullAny(analyticsDataTypesUses[row.fundId][row.dataType])
                    && !isNullAny(analyticsDataTypesUses[row.fundId][row.dataType][row.period])
                    && analyticsDataTypesUses[row.fundId][row.dataType][row.period] >= 3) {
                    return;
                }

                if (isNullAny(analyticsDataTypesUses[row.fundId])) {
                    analyticsDataTypesUses[row.fundId] = {};
                }

                if (isNullAny(analyticsDataTypesUses[row.fundId][row.dataType])) {
                    analyticsDataTypesUses[row.fundId][row.dataType] = {};
                }

                if (isNullAny(analyticsDataTypesUses[row.fundId][row.dataType][row.period])) {
                    analyticsDataTypesUses[row.fundId][row.dataType][row.period] = 0;
                }

                analyticsDataTypesUses[row.fundId][row.dataType][row.period] += 1;

                let rowData = [];
                columns.forEach(col => {
                    if (col === "id") {
                        rowData.push(idCounter++);
                    } else {
                        rowData.push(row[col])
                    }
                });
                filteredArray.push(rowData.join(","));
            });

            fs.writeFileSync(filteredFilename, filteredArray.join("\n"));
        });


    async function getFirstLine(bigFilename) {
        const readline = require('readline');

        const readable = fs.createReadStream(bigFilename);
        const reader = readline.createInterface({input: readable});
        const line = await new Promise((resolve) => {
            reader.on('line', (line) => {
                reader.close();
                resolve(line);
            });
        });
        readable.close();
        return line;
    }
}

async function convertCSV(tableName) {
    if (tableName === "analytics") {
        await filterAnalyticsData();
    }

    if (!fs.existsSync(`${__dirname}/xchain_public_${tableName}.csv`)) {
        return [];
    }

    return csv({ignoreEmpty: true})
        .fromFile(`${__dirname}/xchain_public_${tableName}.csv`)
        .then(async (seedData) => {
            seedData.forEach(obj => {
                Object.keys(obj).forEach(key => {
                    if (["phone"].includes(key)) return;

                    try {
                        obj[key] = JSON.parse(obj[key]);
                    } catch (ignored) {
                        let dateRegex = new RegExp(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}\.\d{3})\d{3}$/);
                        if (dateRegex.test(obj[key])) {
                            let matchGroups = obj[key].match(dateRegex);
                            obj[key] = `${matchGroups[1]}T${matchGroups[2]}Z`;
                        }
                    }
                });
            });

            if (tableName === "users") {
                let indexOfNonVerifiedUser = seedData.indexOf(seedData.find(r => !isNullAny(r.emailVerifyToken)));
                if (indexOfNonVerifiedUser >= 0) {
                    seedData[indexOfNonVerifiedUser].emailVerifyTokenExpiration = new Date("2050-01-01");
                }


                let validatedUserWithReturnChallenge = seedData.filter(r => isNullAny(r.emailVerifyToken) && !isNullAny(r.returnChallenge));

                if (isNullAny(validatedUserWithReturnChallenge)) {
                    let indexOfVerifiedUser = seedData.indexOf(seedData.find(r => isNullAny(r.emailVerifyToken)));

                    if (indexOfVerifiedUser >= 0) {
                        seedData[indexOfVerifiedUser].returnChallenge = "0x123456d73a3339a8e135dc8d413c7c5f8cb0518ae2a9dd69622b6517a3835fef";
                    }
                }
            }

            return seedData;
        });
}

const csvData = {
    addresses: convertCSV("addresses"),
    analytics: convertCSV("analytics"),
    companies: convertCSV("companies"),
    currencyRates: convertCSV("currencyRates"),
    documents: convertCSV("documents"),
    leverageRanges: convertCSV("leverageRanges"),
    projects: convertCSV("projects"),
    sizeRanges: convertCSV("sizeRanges"),
    templates: convertCSV("templates"),
    templatesFoFFund: convertCSV("templatesFoFFund"),
    templatesHistory: convertCSV("templatesHistory"),
    templatesLeverage: convertCSV("templatesLeverage"),
    templatesPDFund: convertCSV("templatesPDFund"),
    templatesPEFund: convertCSV("templatesPEFund"),
    templatesRealFund: convertCSV("templatesRealFund"),
    templatesSnapshot: convertCSV("templatesSnapshot"),
    userAvatars: convertCSV("userAvatars"),
    userInfo: convertCSV("userInfo"),
    userPreferences: convertCSV("userPreferences"),
    users: convertCSV("users"),
    userSettings: convertCSV("userSettings"),
};

const cloneElementFunction = (e) => JSON.parse(JSON.stringify(e));


module.exports = {
    addresses: async () => (await csvData.addresses).map(cloneElementFunction),
    analytics: async () => (await csvData.analytics).map(cloneElementFunction),
    companies: async () => (await csvData.companies).map(cloneElementFunction),
    currencyRates: async () => (await csvData.currencyRates).map(cloneElementFunction),
    documents: async () => (await csvData.documents).map(cloneElementFunction),
    leverageRanges: async () => (await csvData.leverageRanges).map(cloneElementFunction),
    projects: async () => (await csvData.projects).map(cloneElementFunction),
    sizeRanges: async () => (await csvData.sizeRanges).map(cloneElementFunction),
    templates: async () => (await csvData.templates).map(cloneElementFunction),
    templatesFoFFund: async () => (await csvData.templatesFoFFund).map(cloneElementFunction),
    templatesHistory: async () => (await csvData.templatesHistory).map(cloneElementFunction),
    templatesLeverage: async () => (await csvData.templatesLeverage).map(cloneElementFunction),
    templatesPDFund: async () => (await csvData.templatesPDFund).map(cloneElementFunction),
    templatesPEFund: async () => (await csvData.templatesPEFund).map(cloneElementFunction),
    templatesRealFund: async () => (await csvData.templatesRealFund).map(cloneElementFunction),
    templatesSnapshot: async () => (await csvData.templatesSnapshot).map(cloneElementFunction),
    userAvatars: async () => (await csvData.userAvatars).map(cloneElementFunction),
    userInfo: async () => (await csvData.userInfo).map(cloneElementFunction),
    userPreferences: async () => (await csvData.userPreferences).map(cloneElementFunction),
    users: async () => (await csvData.users).map(cloneElementFunction),
    userSettings: async () => (await csvData.userSettings).map(cloneElementFunction),
}