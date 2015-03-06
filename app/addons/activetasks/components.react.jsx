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
  "react",
  "addons/activetasks/stores",
  "addons/activetasks/resources",
  "addons/activetasks/actions"

], function (Helpers, FauxtonAPI, React, Stores, Resources, Actions) {
  var activeTasksStore = Stores.activeTasksStore;
  var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

  var ActiveTasksController = React.createClass({

    getStoreState: function () {
      return {  
        selectedTab: activeTasksStore.getSelectedTab(),
        collection: activeTasksStore.getCollection(),
        searchTerm: activeTasksStore.getSearchTerm(),
        setPolling: activeTasksStore.setPolling,
        clearPolling: activeTasksStore.clearPolling
      };
    },

    getInitialState: function () {
      return this.getStoreState();
    },

    componentDidMount: function () {
      this.state.setPolling();
      activeTasksStore.on('change', this.onChange, this);      
    },

    componentWillUnmount: function() {
      this.state.clearPolling();
      activeTasksStore.off('change', this.onChange, this); 
    },
    onChange: function () {
      this.setState(this.getStoreState());
    },
    render: function () {
      var collection = this.state.collection; 
      var searchTerm = this.state.searchTerm;
      var selectedTab = this.state.selectedTab;

      if (collection.length === 0 ) {
        return ( <div className="active-tasks"><tr><td><p>  No tasks. </p></td></tr></div> );
      } else {
        return (
          <div className="scrollable">
            <div className="inner">
             <ActiveTasksFilterHeader/>
              <ActiveTaskTable collection={collection} searchTerm={searchTerm} selectedTab={selectedTab}/>
            </div>
          </div>
        );
      }
    }
  });

  var ActiveTasksFilterHeader = React.createClass({   //This is for the little '+ Filter' Tab 
    
    getStoreState: function () {
      return { 
        searchTerm: activeTasksStore.getSearchTerm,
        showTabContent: activeTasksStore.isTabVisible 
      };
    },

    getInitialState: function () {
      return this.getStoreState();
    },

    toggleFilter: function () {
      Actions.toggleTabVisibility();
    },

    render: function () {
      var searchbox = '';

      if (this.state.showTabContent()) {
        searchbox = <SearchBox key="searchbox" />;
      }

      return (
        <div id="dashboard-upper-content">
          <div className="dashboard-upper-menu">
            <ul className="nav nav-tabs" id="db-views-tabs-nav">
              <li>
                <a className="js-toggle-filter"
                   data-bypass="true" 
                   data-toggle="tab"
                   href="#filter" onClick={this.toggleFilter}>
                  <i className="fonticon fonticon-plus"></i>
                  Filter
                </a>
              </li>
            </ul>
          </div>
          
          <ReactCSSTransitionGroup transitionName="updown" component="div" className="dashboard-lower-menu">
            {searchbox} 
          </ReactCSSTransitionGroup>
          
        </div>
      );
    }
  });

  var SearchBox = React.createClass({
    setNewSearchTerm: function (e) {
      Actions.setSearchTerm(e.target.value);
    },
    
    render: function () {
      var searchTerm = activeTasksStore.getSearchTerm();

      return (
          <input  
            key='same'
            className="searchbox" 
            type="text" 
            name="search" 
            placeholder="Search for databases..." 
            value={searchTerm}
            onChange={this.setNewSearchTerm} />
      );
    }
  });

  var ActiveTaskTable = React.createClass({
    render: function () {
      var collection = this.props.collection;
      var selectedTab = this.props.selectedTab;
      var searchTerm = this.props.searchTerm;
      var resultsCount = 0;

      return (
        <div id="dashboard-lower-content">
          <table className="table table-bordered table-striped active-tasks">
            <ActiveTasksTableHeader/>
            <ActiveTasksTableBody collection={collection} selectedTab={selectedTab} searchTerm={searchTerm}/>
          </table>
        </div>
      );
    }
  });

  var ActiveTasksTableHeader = React.createClass({
    createTableHeadingFields: function () {
      var sortByHeader = this.sortByHeader;

      return (
        <tr>
          <th onClick={sortByHeader.bind(this, "type", true)}>       Type             </th>
          <th onClick={sortByHeader.bind(this, "database", true)}>   Database         </th>
          <th onClick={sortByHeader.bind(this, "started_on", true)}> Started on       </th>
          <th onClick={sortByHeader.bind(this, "updated_on", true)}> Last updated on  </th>
          <th onClick={sortByHeader.bind(this, "pid", true)}>        PID              </th>
          <th onClick={sortByHeader.bind(this, "progress", true)}>   Status           </th>
        </tr>
      );
    },

    sortByHeader: function (columnName) {
      Actions.sortByColumnHeader(columnName);
    },

    render: function () {
      var tableHeadingFields = this.createTableHeadingFields();
      return (
        <thead>
          {tableHeadingFields}
        </thead>
      );
    }
  });

  var ActiveTasksTableBody = React.createClass({

    rowCount: 0,

    passesTabFilter: function (item) {
      var searchTerm = this.props.searchTerm;
      var regex = new RegExp(searchTerm, 'g');
      
      var itemDatabasesTerm = '';
      if (item.has('database')) {
        itemDatabasesTerm += item.get('database'); 
      }
      if (item.has('source')) {
        itemDatabasesTerm += item.get('source'); 
      }
      if (item.has('target')) {
        itemDatabasesTerm += item.get('target'); 
      }

      if (regex.test(itemDatabasesTerm)) {
        return true;
      }
      return false;
    },

    passesSidebarFilter: function (rowItem) {
      var selectedTab = this.props.selectedTab.toLowerCase();
      var type = rowItem.get('type').replace('_', ' ');
      var matchesSidebarTab = (selectedTab === type);
      
      if (matchesSidebarTab || selectedTab ==='all tasks') {
        return true;
      }
      return false;
    },

    createRows: function () {
      var rowCount = 0;

      var rows = this.props.collection.map(function (item, iteration) {
        //sidebar and search-term-in-tab filters
        if (this.passesSidebarFilter(item) && this.passesTabFilter(item)) {  
          rowCount++;
          return <ActiveTaskTableBodyContents key={item.cid} item={item} />;
        }
      }.bind(this));

      if (rowCount === 0) { //if nothing in table
        this.props.searchTerm === "" ? rows = this.noActiveTasks() : rows = this.noActiveTasksMatchFilter();
      }

      return rows;
    },

    noActiveTasks: function () {
      return (
        <tr className="no-matching-database-on-search">
          <td  colSpan="6">No active {this.props.selectedTab} tasks.</td>
        </tr>
      );
    },

    noActiveTasksMatchFilter: function () {
      return (  
        <tr className="no-matching-database-on-search">
          <td colSpan="6">No active {this.props.selectedTab} tasks match with filter: "{this.props.searchTerm}".</td>
        </tr>
      );
    },

    render: function () {
      var tableBody = this.createRows();

      return (
        <tbody className="js-tasks-go-here">
          {tableBody}
        </tbody>
      );
    }
  });

  var ActiveTaskTableBodyContents = React.createClass({
    getInfo: function (item) {
      return {
        type : item.get('type'),
        objectField: this.getDatabaseFieldMessage(item) ,
        started_on: this.getTimeInfo(item.get('started_on')), 
        updated_on: this.getTimeInfo(item.get('updated_on')),
        pid: item.get('pid').replace(/[<>]/g, ''),
        progress: this.getProgressMessage(item),
      };
    },

    getTimeInfo: function (timeStamp) {
      var timeMessage = [Helpers.formatDate(timeStamp)];
      timeMessage.push(Helpers.getDateFromNow(timeStamp));
      return timeMessage;
    },

    getDatabaseFieldMessage: function (model) {
      var type = model.get('type');
      var databaseFieldMessage = [];

      if (type === 'replication') {
        databaseFieldMessage.push('From: ' + model.get('source'));
        databaseFieldMessage.push('To: ' + model.get('target'));
      } else if (type === 'indexer') {
        databaseFieldMessage.push(model.get('database'));
        databaseFieldMessage.push('(View: ' + model.get('design_document') + ')');
      } else {
        databaseFieldMessage.push(model.get('database'));
      }

      return databaseFieldMessage;
    },

    getProgressMessage: function (model) {
      var progressMessage = [];
      var type = model.get('type');

      if (model.has('progress')) {  progressMessage.push('Progress: ' + model.get('progress') + '%'); }
      
      if (type === 'indexer') { 
        progressMessage.push(
          'Processed ' + model.get('changes_done') + ' of ' + model.get('total_changes') + ' changes.'
        );
      } else if (type === 'replication') {
        progressMessage.push(model.get('docs_written')+ ' docs written.');
        
        if (model.has('changes_pending')) { 
          progressMessage.push(model.get('changes_pending') + ' pending changes.'); 
        }
      }

      if (model.has('source_seq')) { 
        progressMessage.push('Current source sequence: ' + model.get('source_seq') + '. '); 
      }

      if (model.has('changes_done')) {
        progressMessage.push(model.get('changes_done') + ' Changes done.');
       }
      
      return progressMessage;
    },

    multilineMessage: function (messageArray, optionalClassName) {
      var cssClasses = 'multiline-active-tasks-message ' + optionalClassName;

      return messageArray.map(function (msgLine, iterator) {
        return <p key={iterator} className={cssClasses}>{msgLine}</p>;
      });
    },

    render: function () {
      var rowData =  this.getInfo(this.props.item);
      var objectFieldMsg = this.multilineMessage(rowData.objectField);
      var startedOnMsg = this.multilineMessage(rowData.started_on, 'time');
      var updatedOnMsg = this.multilineMessage(rowData.updated_on, 'time');
      var progressMsg = this.multilineMessage(rowData.progress);

      return (
        <tr>
          <td>{rowData.type}</td>
          <td>{objectFieldMsg}</td>
          <td>{startedOnMsg}</td>
          <td>{updatedOnMsg}</td>
          <td>{rowData.pid}</td>
          <td>{progressMsg}</td>
        </tr>
      );
    }
  });

  var ActiveTasksSidebar = React.createClass({

    //This is not a component inside the Controller Component, it is separate, 
    //but it reads/writes to the Active Tasks store
    
    getStoreState: function () {
      return {  
        selectedTab: activeTasksStore.getSelectedTab(),
        pollingInterval:  activeTasksStore.getPollingInterval()
      };
    },

    getInitialState: function () {
      return this.getStoreState();
    },

    tabs : function () {
      return ['All Tasks', 
              'Replication',
              'Database Compaction', 
              'Indexer', 
              'View Compaction'
             ];
    },

    componentDidMount: function () {
       activeTasksStore.on('change', this.onChange, this);      
    },

    switchTab: function (goToTab) {
      Actions.switchTab(goToTab);
    },

    onChange: function () {  
      if (this.isMounted()) {
        this.setState(this.getStoreState());
      }
    },

    selectedTabClass: function (tabName) {
      if (tabName === activeTasksStore.getSelectedTab()) { return 'active'; }
      return '';
    },

    pollingIntervalChange: function (event) {
      Actions.changePollingInterval(event.target.value);
    },

    getPluralForLabel: function () {
      return this.state.pollingInterval === "1" ? '' : 's';
    },

    createTabs: function () {
      var tabs = this.eachTab();
      
      return (
        <ul className="task-tabs nav nav-list">
          {tabs}
        </ul>
      );
    },

    eachTab: function () {
      return (
        this.tabs().map(function (tabName) {
          var switchTabHandle = this.switchTab.bind(this, tabName);
          var selectedTabClass = this.selectedTabClass(tabName);

          return (
            <li 
              key = {tabName} 
              onClick = {switchTabHandle} 
              className = {selectedTabClass}
            >
              <a>{tabName}</a>
            </li>
          );
        }.bind(this))
      );
    },

    createPollingWidget: function () {
      var pollingInterval = this.state.pollingInterval;
      var s = this.getPluralForLabel();
      var onChangeHandle = this.pollingIntervalChange;

      return (
        <ul className="nav nav-list views polling-interval">
          <li className="nav-header">Polling interval</li>
          <li>
            <input 
              id="pollingRange" 
              type="range" 
              min="1" 
              max="30" 
              step="1" 
              value={pollingInterval} 
              onChange={onChangeHandle}
            />
            <label htmlFor="pollingRange"> <span>{pollingInterval}</span> second{s} </label>
          </li>
        </ul>
      );
    },

    render: function () {
      var sidebarTabs = this.createTabs();
      var pollingWidget = this.createPollingWidget();

      return (
        <div>
          {sidebarTabs}
          {pollingWidget}
        </div>
      );
    }
  });
  
  return {
    renderActiveTasks: function (el) {
      React.render(<ActiveTasksController />, el);
    },

    removeActiveTasks: function (el) {
      React.unmountComponentAtNode(el);
    },

    renderActiveTasksSidebar: function (el) {
      React.render(<ActiveTasksSidebar />, el);
    },
    removeActiveTasksSidebar: function (el) {
      React.unmountComponentAtNode(el);
    },

    ActiveTasksController: ActiveTasksController,
    ActiveTasksSidebar: ActiveTasksSidebar,
    ActiveTasksFilterHeader: ActiveTasksFilterHeader,
    ActiveTaskTable: ActiveTaskTable,
    ActiveTasksTableHeader: ActiveTasksTableHeader,
    ActiveTasksTableBody: ActiveTasksTableBody,
    ActiveTaskTableBodyContents: ActiveTaskTableBodyContents,
    SearchBox: SearchBox

  };

});
