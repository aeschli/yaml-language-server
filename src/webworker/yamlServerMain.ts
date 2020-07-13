/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { Connection } from 'vscode-languageserver';
import { createConnection, BrowserMessageReader, BrowserMessageWriter } from 'vscode-languageserver/browser';
import { YAMLServerInit } from '../yamlServerInit';
import { CustomSchemaContentRequest } from '../requestTypes';
import { SettingsState } from '../yamlSettings';
import { WorkspaceContextService } from '../languageservice/yamlLanguageService';
import * as URL from 'url';

declare const self: unknown;

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

const yamlSettings = new SettingsState();

/**
 * Handles schema content requests given the schema URI
 * @param uri can be a local file, vscode request, http(s) request or a custom request
 */
const schemaRequestHandlerWrapper = (connection: Connection, uri: string): Promise<string> => {
  return connection.sendRequest(CustomSchemaContentRequest.type, uri);
};

const schemaRequestService = schemaRequestHandlerWrapper.bind(this, connection);
const workspaceContext: WorkspaceContextService = {
  resolveRelativePath: (relativePath: string, resource: string) => {
    return URL.resolve(resource, relativePath);
  },
};

new YAMLServerInit(connection, yamlSettings, workspaceContext, schemaRequestService).start();
