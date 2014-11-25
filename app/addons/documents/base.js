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
  "app",

  "api",

  // Modules
  "addons/documents/routes"
],

function(app, FauxtonAPI, Documents) {

  FauxtonAPI.registerUrls("allDocs", {
      server: function (id, query) {
        return app.host + "/" + id + "/_all_docs" + query;
      },
      app: function (id, query) {
        return 'database/' + id + "/_all_docs" + query;
      },
      apiurl: function (id, query) {
        return window.location.origin + "/" + id + "/_all_docs" + query;
      }
  });

  FauxtonAPI.registerUrls("designDocs", {
    server: function (id, designDoc) {
      return app.host + "/" + id + "/" + designDoc + '/_info';
    },

    apiurl: function (id, designDoc) {
      return window.location.origin + "/" + id + "/" + designDoc + '/_info';
    },

    app: function (id, designDoc) {
      return 'database/' + id + '/_design/' + app.utils.safeURLName(designDoc) + '/_info';
    }
  });

  return Documents;
});
