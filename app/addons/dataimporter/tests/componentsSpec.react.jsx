// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.
define([
  'api',
  'addons/documents/queryoptions/queryoptions.react',
  'addons/documents/queryoptions/stores',
  'addons/documents/queryoptions/actions',
  'addons/documents/resources',
  'testUtils',
  'react'
], function (FauxtonAPI, Views, Stores, Actions, Documents, utils, React) {
  FauxtonAPI.router = new FauxtonAPI.Router([]);

  var assert = utils.assert;
  var TestUtils = React.addons.TestUtils;
  var restore = utils.restore;

  describe('Data Importer', function () {
    var container, El;

    beforeEach(function () {
      container = document.createElement('div');
    });

    afterEach(function () {
      React.unmountComponentAtNode(container);
    });

    it('should upload the file on drag', function () {

    });

    it('should upload a file through the "Choose File" button', function () {

    });

    it('should prevent uploading files that are too big', function () {

    });

    it('should load data into new target database', function () {

    });

    it('should load data into existing target database', function () {

    });

    it('should navigate to target database after loading', function () {

    });

    it('should show errors in loading, if any', function () {

    });

  });

});
