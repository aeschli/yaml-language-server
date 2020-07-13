/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createConnection, Connection, ProposedFeatures } from 'vscode-languageserver/node';
import { startServer, RuntimeEnvironment } from '../serverCommon';

import { configure as configureHttpRequests } from 'request-light';
import { getSchemaRequestHandler, getSchemaStoreRequestHandler } from './schemaRequestHandler';

// Create a connection for the server.
let connection: Connection = null;

if (process.argv.indexOf('--stdio') === -1) {
	connection = createConnection(ProposedFeatures.all);
} else {
	connection = createConnection();
}

console.log = connection.console.log.bind(connection.console);
console.error = connection.console.error.bind(connection.console);

process.on('unhandledRejection', (e: any) => {
	connection.console.error(formatError(`Unhandled exception`, e));
});

function formatError(message: string, err: any): string {
	if (err instanceof Error) {
		let error = <Error>err;
		return `${message}: ${error.message}\n${error.stack}`;
	} else if (typeof err === 'string') {
		return `${message}: ${err}`;
	} else if (err) {
		return `${message}: ${err.toString()}`;
	}
	return message;
}

const runtime : RuntimeEnvironment = {
	configureHttpRequests: configureHttpRequests,
	schemaRequestHandler: getSchemaRequestHandler(connection),
	schemaStoreRequestHandler: getSchemaStoreRequestHandler(connection)
}

startServer(connection, runtime);
