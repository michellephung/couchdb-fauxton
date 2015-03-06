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
  'addons/activetasks/resources',
  'addons/activetasks/components.react',
  'addons/activetasks/actions'
],

function (app, FauxtonAPI, ActiveTasks, Components, Actions) {

  var Views = {};

  Views.ActiveTasksWrapper = FauxtonAPI.View.extend({
    className: 'active-tasks-wrapper',
    initialize: function (options) {
      this.collection = options.collection;
    },

    establish: function () {
     return [this.collection.fetch()];
    },

    afterRender: function () {
      Actions.setCollection(this.collection);
      Components.renderActiveTasks(this.el);
    },

    cleanup: function () {
      Components.removeActiveTasks(this.el);
    }
  });

  Views.ActiveTasksSidebar = FauxtonAPI.View.extend({
    tagName: 'nav',
    className: 'sidenav active-tasks-sidebar',
    initialize: function (options) {
      Actions.switchTab('All Tasks');
      Actions.changePollingInterval(5);
    },

    afterRender: function () {
      Components.renderActiveTasksSidebar(this.el);
    },

    cleanup: function () {
      Components.removeActiveTasksSidebar(this.el);
    }
  });

  return Views;
});
