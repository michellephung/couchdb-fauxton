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
  'app',
  'api',
  'addons/documents/sidebar/actiontypes'
],
function (app, FauxtonAPI, ActionTypes) {
  return {
    newOptions: function (options) {
      FauxtonAPI.dispatch({
        type: ActionTypes.SIDEBAR_NEW_OPTIONS,
        options: options
      });
    },

    setSelectedTab: function (tab) {
      FauxtonAPI.dispatch({
        type: ActionTypes.SIDEBAR_SET_SELECTED_TAB,
        tab: tab
      });
    }
  };
});
