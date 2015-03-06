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
  "app/helpers",
  "api",
  "addons/activetasks/actiontypes"
], function (Helpers, FauxtonAPI, ActionTypes) {

  var ActiveTasksStore = FauxtonAPI.Store.extend({  
    getSelectedTab: function () {
      return this._selectedTab;
    },

    setSelectedTab: function (selectedTab) {
      this._selectedTab = selectedTab;
    },

    getPollingInterval: function () {
      return this._pollingInterval;
    },

    setPollingInterval: function (pollingInterval) {
      this._pollingInterval = pollingInterval;
    },

    setPolling: function () {
      clearInterval(this.getIntervalID());

      var id = setInterval(function () {
        this.setCollection(this._collection.pollingFetch());
        this.sortCollectionByColumnHeader(this._prevSortbyHeader, false);
        this.triggerChange();
      }.bind(this), this.getPollingInterval() * 1000);

      this.setIntervalID(id);
    },

    clearPolling: function () {
      clearInterval(this.getIntervalID());
    },

    getIntervalID: function () {
      return this._intervalID;
    },

    setIntervalID: function (id) {
      this._intervalID = id;
    },

    setCollection: function (collection) {
      this._collection = collection;
    },

    getCollection: function () {
      return this._collection; 
    },

    setSearchTerm: function (searchTerm) {
      this._searchTerm = searchTerm;
    },

    getSearchTerm: function () {
      if (_.isUndefined(this._searchTerm)) {
        this._searchTerm = '';
      }
      return this._searchTerm;
    },

    isTabVisible: function () {
      
      if (_.isUndefined(this._tabIsVisible)) {
        this._tabIsVisible = false;
      }
      return this._tabIsVisible;
    },

    toggleTabVisibility: function () {
      this._tabIsVisible = !this._tabIsVisible;
    },

    sortCollectionByColumnHeader: function (colName) {
      var sorted;

      if (this._prevSortbyHeader === colName) {
        sorted = this._collection.models.reverse();
      } else {
        sorted = _.sortBy(this._collection.models, function (item) {
          var variable = colName;
          if (_.isUndefined(item.get(variable))) {
            variable = 'source';
          }
          return item.get(variable);
        }.bind(this));
      }
      this._prevSortbyHeader = colName;
      this._collection.models = sorted;
    },

    dispatch: function (action) {
      switch (action.type) {

        case ActionTypes.ACTIVE_TASKS_CHANGE_POLLING_INTERVAL:
          this.setPollingInterval(action.options);
          this.setPolling();
          this.triggerChange();
        break;

        case ActionTypes.ACTIVE_TASKS_SWITCH_TAB:
          this.setSelectedTab(action.options);
          this.triggerChange();
        break;

        case ActionTypes.ACTIVE_TASKS_SET_COLLECTION:
          this.setCollection(action.options);
          this.triggerChange();
        break;

        case ActionTypes.ACTIVE_TASKS_SET_SEARCH_TERM:
          this.setSearchTerm(action.options);
          this.triggerChange();
        break;

        case ActionTypes.ACTIVE_TASKS_SORT_BY_COLUMN_HEADER:
          this.sortCollectionByColumnHeader(action.options.columnName);
          this.triggerChange();
        break;

        case ActionTypes.ACTIVE_TASKS_START_TIME_SINCE:
          this.startTimeSince();
          this.triggerChange();
        break;

        case ActionTypes.ACTIVE_TASKS_TOGGLE_FILTER_TAB:
          this.toggleTabVisibility();
          this.triggerChange();
        break;

        default:
          return;
      }
    }
  });

  var activeTasksStore = new ActiveTasksStore();
  activeTasksStore.dispatchToken = FauxtonAPI.dispatcher.register(activeTasksStore.dispatch.bind(activeTasksStore));
  return {
    activeTasksStore: activeTasksStore
  };

});
