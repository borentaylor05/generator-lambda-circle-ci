const AWS = require('aws-sdk');
const {functionName, awsRegion} = require('../config');

AWS.config.update({region: awsRegion});

const lambda = new AWS.Lambda();

function updateAlias(functionName, version) {
    const params = {
        FunctionName: functionName,
        FunctionVersion: version,
        Name: 'PROD'
    };

    lambda.updateAlias(params, function(err) {
        if (err) throw new Error(`Error updating PROD to STAGE version`); // an error occurred
        else     console.info(`Updated PROD to point to version ${version}`); // successful response
    });
}

const params = {
    FunctionName: functionName,
    Name: 'STAGE'
};

lambda.getAlias(params, function(err, data) {
    if (err) throw new Error(`Error updating function code on DEV: ${err.stack}`);

    console.info(`Attempting to update PROD to point to version ${data.FunctionVersion}`);

    updateAlias(functionName, data.FunctionVersion);
});
