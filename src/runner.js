const path = require('path');
const isValidJson = require('is-valid-json');

function parsePayload(filename) {
    const payloadContents = require(path.resolve(process.cwd() + '/' + filename));
    if (isValidJson(payloadContents)) {
        return payloadContents;
    }

    let payloadJSON = null;
    try {
        payloadJSON = JSON.parse(payloadContents);
    } catch (e) {
        throw e;
    }

    return payloadJSON;
}

function run(lambdaPath, handlerName, payloadFilename) {

    if (!lambdaPath) {
        console.error('Must provide lambda path.');
        return;
    }

    require('babel-register')({
        presets: [['env', { targets: { node: 'current' } }]]
    });

    console.log('Handler:', handlerName);
    console.log('Payload Filename:', payloadFilename);
    console.log('Lambda Path:', lambdaPath);

    let eventJSON = null;

    try {
        eventJSON = parsePayload(payloadFilename);
    } catch (e) {
        console.error('Unable to parse payload file.');
        console.error(e);

        return;
    }

    try {
        lambdaRequire = require(path.resolve(process.cwd() + '/' + lambdaPath));
    } catch (e) {
        console.error('Unable to require lambda file.');
        console.error(e);

        return;
    }

    const handler = lambdaRequire[handlerName];
    if (!handler) {
        console.error('Handler not found in lambda definition.');
        return;
    }

    try {
        handler(eventJSON, {}, (err, res) => {
            if (err) {
                console.log('LAMBDA RETURNED ERROR');
                console.log(err);
                return;
            }

            console.log('LAMBDA RETURN SUCCEEDED');
            console.log(res);
        });
    } catch (e) {
        console.error('Error running Lambda handler.')
        console.error(e);

        return;
    }
}

module.exports = run;
