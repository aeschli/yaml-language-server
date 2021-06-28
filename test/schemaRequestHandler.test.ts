/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { schemaRequestHandler } from '../src/languageservice/services/schemaRequestHandler';
import * as sinon from 'sinon';
import * as fs from 'fs';
import { Connection } from 'vscode-languageserver';
import * as assert from 'assert';
import { URI } from 'vscode-uri';
import { testFileSystem } from './utils/testHelper';

describe('Schema Request Handler Tests', () => {
  describe('schemaRequestHandler', () => {
    const sandbox = sinon.createSandbox();
    let readFileStub: sinon.SinonStub;

    beforeEach(() => {
      readFileStub = sandbox.stub(testFileSystem, 'readFile');
      readFileStub.returns(Promise.resolve('{some: "json"}'));
    });

    afterEach(() => {
      sandbox.restore();
    });
    it('Should care Win URI', async () => {
      const connection = <Connection>{};
      const resultPromise = schemaRequestHandler(connection, 'c:\\some\\window\\path\\scheme.json', [], URI.parse(''), false, testFileSystem);
      assert.ok(readFileStub.calledOnceWith('c:\\some\\window\\path\\scheme.json'));
      const result = await resultPromise;
      assert.equal(result, '{some: "json"}');
    });

    it('UNIX URI should works', async () => {
      const connection = <Connection>{};
      const resultPromise = schemaRequestHandler(connection, '/some/unix/path/', [], URI.parse(''), false, testFileSystem);
      const result = await resultPromise;
      assert.equal(result, '{some: "json"}');
    });
  });
});
