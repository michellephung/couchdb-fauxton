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
  'core/base',
  'core/layout',
  'core/router',
  'core/routeObject',
  'core/utils'
],

function(FauxtonAPI, Layout, Router, RouteObject, utils) {
  FauxtonAPI = _.extend(FauxtonAPI, {
    Layout: Layout,
    Router: Router,
    RouteObject: RouteObject,
    utils: utils
  });

  FauxtonAPI.Events = _.extend({}, Backbone.Events);

  FauxtonAPI.navigate = function (url, _opts) {
    var options = _.extend({trigger: true}, _opts);
    FauxtonAPI.router.navigate(url, options);
  };

  FauxtonAPI.beforeUnload = function () {
    FauxtonAPI.router.beforeUnload.apply(FauxtonAPI.router, arguments);
  };

  FauxtonAPI.removeBeforeUnload = function () {
    FauxtonAPI.router.removeBeforeUnload.apply(FauxtonAPI.router, arguments);
  };

  FauxtonAPI.addRoute = function (route) {
    FauxtonAPI.router.route(route.route, route.name, route.callback);
  };

  FauxtonAPI.triggerRouteEvent = function (routeEvent, args) {
    FauxtonAPI.router.triggerRouteEvent("route:" + routeEvent, args);
  };

  var urlPaths = {};

  FauxtonAPI.registerUrls = function (namespace, urls) {
    urlPaths[namespace] = urls;
  };

  //This is a little rough and needs some improvement. But the basic concept is there
  FauxtonAPI.urls = function (name, context) {
    var interceptors = FauxtonAPI.getExtensions('urls:interceptors')[0];
    //if (_.isEmpty(interceptors)) { interceptors = function () { return false; };}
    var args = Array.prototype.slice.call(arguments, 2);

    var out = interceptors.apply(null, arguments);

    if (out) { return out; }

    if (!urlPaths[name][context]) {
      console.trace();
      console.log('could not find', name, context);
    }

    out = urlPaths[name][context].apply(null, args);

    console.log('normal url', out);
    return out;
  };


  
  return FauxtonAPI;
});

