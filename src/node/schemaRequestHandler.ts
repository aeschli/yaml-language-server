/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from 'vscode-uri';
import { Connection } from 'vscode-languageserver';
import { xhr, XHRResponse, getErrorStatusDescription } from 'request-light';
import * as fs from 'fs';

import { SchemaContentRequest, CustomSchemaContentRequest } from '../requestTypes';
import { SchemaRequestService } from '../languageservice/yamlLanguageService';

/**
 * Create as schema content request handler
 */
export function getSchemaRequestHandler(connection: Connection): SchemaRequestService {

    /* @param uri can be a local file, vscode request, http(s) request or a custom request*/
    return (uri: string) => {
        if (!uri) {
            return Promise.reject('No schema specified');
        }
        const scheme = URI.parse(uri).scheme.toLowerCase();

        // If the requested schema is a local file, read and return the file contents
        if (scheme === 'file') {
            const fsPath = URI.parse(uri).fsPath;

            return new Promise<string>((c, e) => {
                fs.readFile(fsPath, 'UTF-8', (err, result) =>
                // If there was an error reading the file, return empty error message
                // Otherwise return the file contents as a string
                { return err ? e('') : c(result.toString()); }
                );
            });
        }

        // vscode schema content requests are forwarded to the client through LSP
        // This is a non-standard LSP extension introduced by the JSON language server
        // See https://github.com/microsoft/vscode/blob/master/extensions/json-language-features/server/README.md
        if (scheme === 'vscode') {
            return connection.sendRequest(SchemaContentRequest.type, uri)
                .then(responseText => { return responseText; }, error => { return error.message; });
        }

        // HTTP(S) requests are sent and the response result is either the schema content or an error
        if (scheme === 'http' || scheme === 'https') {
            // If it's an HTTP(S) request to Microsoft Azure, log the request
            if (uri.indexOf('//schema.management.azure.com/') !== -1) {
                connection.telemetry.logEvent({
                    key: 'json.schema',
                    value: {
                        schemaURL: uri
                    }
                });
            }

            // Send the HTTP(S) schema content request and return the result
            const headers = { 'Accept-Encoding': 'gzip, deflate' };
            return xhr({ url: uri, followRedirects: 5, headers })
                .then(response => { return response.responseText; },
                    (error: XHRResponse) => { return Promise.reject(error.responseText || getErrorStatusDescription(error.status) || error.toString()); });
        }

        // Neither local file nor vscode, nor HTTP(S) schema request, so send it off as a custom request
        return connection.sendRequest(CustomSchemaContentRequest.type, uri);
    }
}

/**
 * Create as schema store request handler
 */
export function getSchemaStoreRequestHandler(connection: Connection) {
    return (url: string) => {
        return xhr({ url: url }).then(response => { return response.responseText; })
    }
}

