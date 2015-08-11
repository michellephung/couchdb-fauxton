/ Licensed under the Apache License, Version 2.0 (the "License"); you may not
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
  "react"
], function (FauxtonAPI, Views, Stores, Actions, Documents, utils, React) {
  FauxtonAPI.router = new FauxtonAPI.Router([]);

  var assert = utils.assert;
  var TestUtils = React.addons.TestUtils;
  var restore = utils.restore;

  describe('Data importer', function () {
    var container, El;

    beforeEach(function () {
      container = document.createElement('div');
    });

    afterEach(function () {
      React.unmountComponentAtNode(container);
    });

  });
