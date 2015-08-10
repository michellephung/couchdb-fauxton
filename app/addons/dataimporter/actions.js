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
  'addons/dataimporter/actiontypes',
  'addons/dataimporter/resources'
],
function (FauxtonAPI, ActionTypes, Resources) {
  return {
    dataImporterInit: function (firstTimeHere) {
      FauxtonAPI.dispatch({
        type: ActionTypes.DATA_IMPORTER_INIT,
        firstTimeHere: firstTimeHere
      });
    },

    dataIsCurrentlyLoading: function () {
      FauxtonAPI.dispatch({
        type: ActionTypes.DATA_IMPORTER_DATA_IS_CURRENTLY_LOADING
      });
    },

    loadFile: function (file) {
      FauxtonAPI.dispatch({
        type: ActionTypes.DATA_IMPORTER_LOAD_FILE,
        file: file
      });
    },

    setPreviewView: function (viewType) {
      FauxtonAPI.dispatch({
        type: ActionTypes.DATA_IMPORTER_SET_PREVIEW_VIEW,
        view: viewType
      });
    },

    setParseConfig: function (key, value) {
      FauxtonAPI.dispatch({
        type: ActionTypes.DATA_IMPORTER_SET_PARSE_CONFIG,
        key: key,
        value: value
      });
    },
    loadDataIntoDatabase: function (targetDB) {
      FauxtonAPI.dispatch({
        type: ActionTypes.DATA_IMPORTER_LOAD_DATA_INTO_DB,
        targetDB: targetDB
      });
    }
  };
});
