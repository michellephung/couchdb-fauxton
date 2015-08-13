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
  'addons/dataimporter/actiontypes',
  'papaparse'
], function (app, FauxtonAPI, ActionTypes, Papa) {

  Papa.SCRIPT_PATH = '../../assets/js/libs/papaparse.min.js';

  var DataImporterStore = FauxtonAPI.Store.extend({

    init: function (firstTimeHere) { //to reset, call this with true
      if (firstTimeHere) {
        this._isDataCurrentlyLoading = false;
        this._hasDataLoaded = false;
        this._hasErrored = false;
        this._theData = [];
        this._theMetadata = [];
        this._smallData = [];
        this._showView = 'table';
        this._theFile = { size: 0 };
        this._config = this.getDefaultConfig();
        this._completeFn = this._config.complete;
        this._errorFn = this._config.error;
        this._fileSize = 0;
        this._time = "just started";
        this._repeatTimeID;
        this.fetchAllDBs();
        this._chunkedData = [];
        this._maxSize = 150000000;  //in bytes
      } // else keeps store as it was when you left
    },

    fetchAllDBs: function () {
      $.ajax({
        method: "GET",
        dataType: "json",
        url: window.location.origin + "/_all_dbs"
      }).then(function (resp) {
        this._all_dbs = _.filter(resp, function (dbName) {
          return dbName[0] !== '_'; //_all_dbs without _ as first letter
        });
        this.triggerChange();
      }.bind(this));
    },

    getMaxSize: function () {
      return this._maxSize;
    },

    getAllDBs: function () {
      return this._all_dbs;
    },

    isDataCurrentlyLoading: function () {
      return this._isDataCurrentlyLoading;
    },

    dataIsLoading: function () {
      this._startTime = app.helpers.moment();
      this._isDataCurrentlyLoading = true;
    },

    hasDataLoaded: function () {
      return this._hasDataLoaded;
    },

    dataLoaded: function () {
      this._hasDataLoaded = true;
      clearInterval(this._repeatTimeID);
    },

    loadData: function (data) {
      this._theData = data;
    },

    getFileSize: function () {
      return this._theFile.size;
    },

    isThisABigFile: function () {
      return this._theFile.size > 750000 ? true : false;
    },

    getTimeSinceLoad: function () {
      return this._time;
    },

    repeatTime: function () {
      this._repeatTimeID = setInterval(function () {
        var secondsElapsed = app.helpers.moment().diff(this._startTime);
        this._time = app.helpers.getDateFromNow(this._startTime);
        if (secondsElapsed < 60000) {
          this._time = '~' + Math.ceil(secondsElapsed / 1000) + ' seconds ago';
        }
        this.triggerChange();
      }.bind(this), 3000);
    },

    loadMeta: function (meta) {
      this._theMetadata = meta;
    },

    loadFile: function (file) {
      this._theFile = file;
      this.repeatTime();
    },

    getTotalRows: function () {
      return this._totalRows;
    },

    getPreviewView: function () {
      return this._showView;
    },

    setPreviewView: function (type) {
      this._showView = type;
    },

    calcSmallPreviewOfData: function () {
      var filesize = this._theFile.size,
          rows = this._totalRows,
          sizeOfEachRow = filesize / rows, //this is approximate
          sizeCap = 750000,  //in bytes
          numberOfRowsToShow;

      numberOfRowsToShow = Math.ceil(sizeCap / sizeOfEachRow);

      this._rowsShown = numberOfRowsToShow;
      this._smallData = this._theData.slice(0, this._rowsShown);
    },

    getSmallPreviewOfData: function () {
      return this._smallData;
    },

    getRowsShown: function () {
      return this._rowsShown;
    },

    getTheMetadata: function () {
      return this._theMetadata;
    },

    getTheData: function () {
      return this._theData;
    },

    papaparse: function () {
      //for some reason this._config.complete gets overwritten on setconfig
      this._config.complete = this._completeFn;
      this._config.error = this._errorFn;
      Papa.parse(this._theFile, this._config);
    },

    loadingComplete: function (results) {
      this.loadMeta(results.meta);
      this.loadData(results.data);
      this._totalRows = this._theData.length;

      if (this.isThisABigFile()) {
        this.calcSmallPreviewOfData();
      }

      this.chunkData();
      this.dataLoaded();
      this.triggerChange();
    },

    chunkData: function () {
      for (var i = 0; i < this._theData.length; i += 500) {
        var oneChunk = this._theData.slice(i, i + 500);
        this._chunkedData.push(oneChunk);
      }
    },

    clearData: function () {
      this._theData = [];
    },

    setParseConfig: function (key, value) {
      this._config[key] = value;
    },

    getConfigSetting: function (key) {
      return this._config[key];
    },

    getDefaultConfig: function () {
      return {
        delimiter : '',  // auto-detect
        newline: '',  // auto-detect
        header: true,
        dynamicTyping: true,
        preview: 0,
        encoding: '',
        worker: true, //true = page doesn't lock up
        comments: false,
        complete: function (results) {
          this.loadingComplete(results);
          this._changingConfig = false;
        }.bind(this),
        error: function () {
          var msg1 = 'There was an error while parsing the file.',
              msg2 = 'Please try again.';

          this.goToErrorScreen(msg1, msg2);
        }.bind(this),
        download: false,
        skipEmptyLines: false,
        chunk: undefined, //define function for streaming
        beforeFirstChunk: undefined,
      };
    },

    loadDataIntoDatabase: function (createNewDB, targetDB) {
      if (createNewDB) {
        if (this.dataBaseIsnew(targetDB)) {
          var msg1 = 'The database ' + targetDB + ' already exists.',
              msg2 = 'Are you sure you want to load the file into ' + targetDB + '?';

          this.goToErrorScreen(msg1, msg2);
        }
        this.loadIntoNewDB(targetDB);
      } else {
        this.loadDataIntoTarget(targetDB);
      }
    },

    dataBaseIsnew: function (targetDB) {
      return _.some(this._all_dbs, targetDB);
    },

    goToErrorScreen: function () {
      console.log(arguments);
      this._errorMessage();
      this.triggerChange();
    },

    loadIntoNewDB: function (targetDB) {
      $.ajax({
        url: FauxtonAPI.urls('databaseBaseURL', 'server', targetDB),
        xhrFields: { withCredentials: true },
        contentType: 'application/json; charset=UTF-8',
        method: 'PUT'
      }).then(function (resp) {
        this.loadDataIntoTarget(targetDB);
      }.bind(this), function (resp) {
        this.importFailed();
      }.bind(this));
    },

    loadDataIntoTarget: function (targetDB) {

      var loadURL = FauxtonAPI.urls('document', 'server', targetDB, '_bulk_docs');
      _.each(this._chunkedData, function (data, i) {
        var payload = JSON.stringify({ 'docs': data });
        console.log(i);
        $.ajax({
          url: loadURL,
          xhrFields: { withCredentials: true },
          contentType: 'application/json; charset=UTF-8',
          method: 'POST',
          data: payload
        }).then(function (resp) {
          this.successfulImport(targetDB);
          i++;
          if (i === this._chunkedData.length ) {
            console.log("alldone");
          }
        }.bind(this), function (resp) {
          this.importFailed();
        }.bind(this));
      }.bind(this));
    },

    successfulImport: function (targetDB) {
      FauxtonAPI.navigate(FauxtonAPI.urls('allDocs', 'app', targetDB, '?include_docs=true'));
    },

    importFailed: function (resp) {
      console.log("errrrr", resp); //dosomething here
    },

    dispatch: function (action) {
      switch (action.type) {
        case ActionTypes.DATA_IMPORTER_INIT:
          this.init(action.firstTimeHere);
          this.triggerChange();
        break;

        case ActionTypes.DATA_IMPORTER_DATA_IS_CURRENTLY_LOADING:
          this.dataIsLoading();
          this.triggerChange();
        break;

        case ActionTypes.DATA_IMPORTER_LOAD_FILE:
          this.loadFile(action.file);
          this.papaparse(action.file);
          this.triggerChange();
        break;

        case ActionTypes.DATA_IMPORTER_SET_PREVIEW_VIEW:
          this.setPreviewView(action.view);
          this.triggerChange();
        break;

        case ActionTypes.DATA_IMPORTER_SET_PARSE_CONFIG:
          this.setParseConfig(action.key, action.value);
          this.clearData();
          this.papaparse(this._theFile);
        break;

        case ActionTypes.DATA_IMPORTER_GET_ALL_DBS:
          this.getAllDBs(action.databases);
        break;

        case ActionTypes.DATA_IMPORTER_LOAD_DATA_INTO_DB:
          this.loadDataIntoDatabase(action.targetDBdata.isExisting, action.targetDBdata.targetDB);
        break;

        default:
        return;
      }
    }
  });

  var dataImporterStore = new DataImporterStore();
  dataImporterStore.dispatchToken = FauxtonAPI.dispatcher.register(dataImporterStore.dispatch.bind(dataImporterStore));

  return {
    dataImporterStore: dataImporterStore
  };
});
