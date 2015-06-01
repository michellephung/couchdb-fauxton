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
  'addons/activetasks/actiontypes'
],
function (FauxtonAPI, ActionTypes, Resources) {
  return {
    fetchAndSetActiveTasks: function (options) {
      var activeTasks = options;

      FauxtonAPI.when(activeTasks.fetch()).then(function () {
        this.init(activeTasks.table, activeTasks);
      }.bind(this));
    },

    init: function (collection, backboneCollection) {
      FauxtonAPI.dispatch({
        type: ActionTypes.ACTIVE_TASKS_INIT,
        options: {
          collectionTable: collection,
          backboneCollection: backboneCollection
        }
      });
    },
    changePollingInterval: function (interval) {
      FauxtonAPI.dispatch({
        type: ActionTypes.ACTIVE_TASKS_CHANGE_POLLING_INTERVAL,
        options: interval
      });
    },
    setCollection: function (collection) {
      FauxtonAPI.dispatch({
        type: ActionTypes.ACTIVE_TASKS_SET_COLLECTION,
        options: collection
      });
    }
  };
});
