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
  'addons/activetasks/views'
],

function (app, FauxtonAPI, Activetasks, Views) {

  var ActiveTasksRouteObject = FauxtonAPI.RouteObject.extend({
    selectedHeader: 'Active Tasks',
    layout: 'with_tabs_sidebar',
    routes: {
      'activetasks/:id': 'showActiveTasks',
      'activetasks': 'showActiveTasks'
    },
    crumbs: [
      {'name': 'Active tasks', 'link': 'activetasks'}
    ],
    apiUrl: function () {
      var apiurl = window.location.origin + '/_active_tasks';
      return [ apiurl, FauxtonAPI.constants.DOC_URLS.ACTIVE_TASKS];
    },
    roles: ['_admin'],
    initialize: function () {
      this.allTasks = new Activetasks.AllTasks();
    },
    showActiveTasks: function () {
      this.activeTasksSection = this.setView('#dashboard-content', new Views.ActiveTasksWrapper({collection: this.allTasks}));
      this.sidebar = this.setView('#sidebar-content', new Views.ActiveTasksSidebar({}));
    }
  });

  Activetasks.RouteObjects = [ActiveTasksRouteObject];

  return Activetasks;
});
