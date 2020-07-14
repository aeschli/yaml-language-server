/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
 
import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';
import { startServer, RuntimeEnvironment } from '../serverCommon';
import { SchemaStoreRequest, SchemaContentRequest } from '../requestTypes';

declare const self: any;

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

const runtime: RuntimeEnvironment = {
    configureHttpRequests: () => { },
    schemaRequestHandler: (uri: string) => {
        return connection.sendRequest(SchemaContentRequest.type, uri);
    },
    schemaStoreRequestHandler: (uri: string) => {
        return connection.sendRequest(SchemaStoreRequest.type, uri);
    }
}

startServer(connection, runtime);
