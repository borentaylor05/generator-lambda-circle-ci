const fs = require('fs');
const AWS = require('aws-sdk');
const {functionName, roleArn, awsRegion} = require('../config');

AWS.config.update({region: awsRegion});

const lambda = new AWS.Lambda();

function createAliases(functionName, version) {
    const baseParams = {
        FunctionName: functionName, /* required */
        FunctionVersion: version, /* required */
    };

    const devParams = {
        ...baseParams,
        Name: 'DEV', /* required */
        Description: 'Lambda to develop against',
    };

    const stageParams = {
        ...baseParams,
        Name: 'STAGE', /* required */
        Description: 'Will point to whatever is on master'
    };

    const prodParams = {
        ...baseParams,
        Name: 'PROD', /* required */
        Description: 'Requires a manual assignment in Lambda UI'
    };

    const aliasParamsArr = [devParams, stageParams, prodParams];

    aliasParamsArr.forEach(params => {
        lambda.createAlias(params, function(err) {
            if (err) console.info(`Error creating alias: ${params.Name}`, err.stack); // an error occurred
            else     console.info(`Created alias: ${params.Name}`);           // successful response
        });
    });
}

fs.readFile(`${functionName}.zip`, function (err, data) {
    if (err) { throw err; }

    var buffer = new Buffer(data, 'binary');

    const params = {
        Description: 'A test function',
        FunctionName: functionName,
        Handler: 'index.handler',
        Publish: true,
        Role: roleArn,
        Runtime: 'nodejs8.10',
        Code: {
            ZipFile: buffer
        }
    };

    lambda.createFunction(params, function(err, data) {
        if (err) return console.info(err, err.stack);

        console.info(`Function created: ${functionName}`);

        createAliases(functionName, data.Version);
    });
});
