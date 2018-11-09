#!/usr/bin/env node

const commander = require('commander');
const alsr = require('..');
const project = require('../package.json');

commander
	.version(project.version)
    .description('AWS Lambda Sandbox Runner');

commander
    .command('run')
    .alias('r')
    .option('-l, --lambda-path [lambda-path]', 'relative path to lambda file')
    .option('-h, --handler [handler]', 'name of handler')
    .option('-p, --payload-filename [filename]', 'payload json (file)')
    .action(command => {
        const handler = command.handler || 'handler';
		const payloadFilename = command.payloadFilename || {};
        const lambdaPath = command.lambdaPath;

        alsr.run(lambdaPath, handler, payloadFilename);
    });

commander.parse(process.argv);
