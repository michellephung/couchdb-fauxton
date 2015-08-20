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


// This file creates a set of helper functions that will be loaded for all html
// templates. These functions should be self contained and not rely on any
// external dependencies as they are loaded prior to the application. We may
// want to change this later, but for now this should be thought of as a
// "purely functional" helper system.

define([
  'constants',
  "core/utils",
  "d3",
  'moment'
],

function (constants, utils, d3, moment) {

  var Helpers = {};

  Helpers.removeSpecialCharacters = utils.removeSpecialCharacters;

  Helpers.safeURL = utils.safeURLName;

  Helpers.imageUrl = function (path) {
    // TODO: add dynamic path for different deploy targets
    return path;
  };

  Helpers.getDocUrl = function (key) {
    return (_.has(constants.DOC_URLS, key)) ? constants.DOC_URLS[key] : '#';
  };

  // File size pretty printing, taken from futon.format.js
  Helpers.formatSize = function (size) {
      var jump = 512;
      if (size < jump) return size + " bytes";
      var units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      var i = 0;
      while (size >= jump && i < units.length) {
        i += 1;
        size /= 1024;
      }
      return size.toFixed(1) + ' ' + units[i - 1];
    };

  Helpers.formatDate = function (timestamp) {
    return moment(timestamp, 'X').format('MMM Do, h:mm:ss a');
  };
  Helpers.getDateFromNow = function (timestamp) {
    return moment(timestamp, 'X').fromNow();
  };

  Helpers.moment = function () {
    return moment();
  };

  return Helpers;
});

