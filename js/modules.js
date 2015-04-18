(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(ngModule) {

  ngModule.directive('geocode', ['geocodeService', function(geocodeService) {

    var location,
    directive = {
      restrict: 'E',
      replace: false,
      scope: {
        callback: '='
      },
      templateUrl: '/templates/geocode.html',
      controllerAs: 'ctrl'
    };

    directive.link = function($scope) {

      $scope.invalidZip = false;

      $scope.resetZipValid = function() {
        $scope.invalidZip = false;
      };

      $scope.getLatLon = function() {

        geocodeService.getLatLon($scope.zipcode)
        .success(function(data) {

          if (data[0].zipcodes === undefined) {
            $scope.invalidZip = true;
            return;
          }

          location = {
            coords : {
              latitude: data[0].zipcodes[0].latitude,
              longitude: data[0].zipcodes[0].longitude
            }
          };

          if ($scope.callback) {
            $scope.callback(location);
          }

        })
        .error(function(data) {

        });
      };

    };

    return directive;

  }]);

  ngModule.run(['$templateCache', function($templateCache){
    $templateCache.put('/templates/geocode.html',
      require('./geocode--template.html'));
  }]);

};

},{"./geocode--template.html":3}],2:[function(require,module,exports){
module.exports = function(ngModule) {
  ngModule.factory('geocodeService', ['$http', '$q', function($http, $q){

    return {
      getLatLon: function(zip) {

        // input validation here. If input is a zip code continue. Else fail;

        var url = 'https://api.smartystreets.com/zipcode' +
                  '?auth-id=3528212138785631906' +
                  '&city=&state=&zipcode=' + zip;

        return $http.get(url);

      }
    };
  }]);
};

},{}],3:[function(require,module,exports){
module.exports = "  <label>Zip Code</label>\n  <form name=\"geocodeForm\" ng-submit=\"getLatLon()\" novalidate >\n    <div class=\"input-group form-group input-group-lg\">\n      <input class=\"form-control\" name=\"zipcode\" ng-change=\"resetZipValid()\" ng-model=\"zipcode\" ng-minlength=\"5\" ng-maxlength=\"10\" ng-pattern=\"/^\\d{5}(?:[-\\s]\\d{4})?$/\" type=\"text\" placeholder=\"Zip Code\"/>\n      <span class=\"input-group-btn\">\n        <button class=\"btn btn-default\">\n          <span class=\"glyphicon glyphicon-search\"></span>\n        </button>\n      </span>\n    </div>\n\n    <p class=\"alert alert-danger\" ng-show=\"geocodeForm.zipcode.$error.pattern && !geocodeForm.zipcode.$error.minlength\">\n      Please enter a valid 5-digit VA ZIP code\n    </p>\n\n    <p class=\"alert alert-warning\" ng-show=\"invalidZip\">\n      Invalid ZIP code\n    </p>\n\n  </form>\n";

},{}],4:[function(require,module,exports){
'use strict';

var geocodeModule = angular.module('geocodeModule', []);

require('./geocode--service.js')(geocodeModule);
require('./geocode--directive.js')(geocodeModule);

},{"./geocode--directive.js":1,"./geocode--service.js":2}],5:[function(require,module,exports){
module.exports = function(ngModule) {

  ngModule.directive('geolocation', ['geolocationService', function(geolocationService){

    var directive = {
      restrict: 'E',
      replace: false,
      scope: {
        callback: '='
      },
      templateUrl: '/templates/geolocation.html',
      controllerAs: 'ctrl'
    };

    directive.link = function($scope) {
      $scope.getLocation = function() {
        geolocationService.getLatLon()
        .then(function(position) {

          if ($scope.callback) {
            $scope.callback(position);
          }

        });
      };
    };

    return directive;

  }]);

  ngModule.run(['$templateCache', function($templateCache){
    $templateCache.put('/templates/geolocation.html',
      require('./geolocation--template.html'));
  }]);

};

},{"./geolocation--template.html":7}],6:[function(require,module,exports){
module.exports = function(ngModule) {

  ngModule.factory('geolocationService', ['$q', '$timeout', function($q, $timeout) {
    return {

      getLatLon: function() {

        var deferred = $q.defer();

        function countdown() {
          deferred.reject('The request to get user information timed out');
        }

        $timeout(countdown, 5000);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            $timeout.cancel(countdown);

            deferred.resolve({
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            });

          }, function(error) {

            $timeout.cancel(countdown);

            var errorCode;
            switch(error.code) {
              case error.PERMISSION_DENIED:
                  errorCode = 'User denied the request for Geolocation.';
                  break;
              case error.POSITION_UNAVAILABLE:
                  errorCode = 'Location information is unavailable.';
                  break;
              case error.TIMEOUT:
                  errorCode = 'The request to get user location timed out.';
                  break;
              case error.UNKNOWN_ERROR:
                  errorCode = 'An unknown error occurred.';
                  break;
            }

            deferred.reject(errorCode);

          });

          return deferred.promise;

        }
      }

    };
  }]);
};

},{}],7:[function(require,module,exports){
module.exports = "<label>Using GPS</label>\n<form ng-submit=\"getLocation()\" class=\"input-group form-group\" novalidate>\n  <button class=\"btn btn-primary btn-lg\">GPS</button>\n</form>\n";

},{}],8:[function(require,module,exports){
'use strict';

var geolocationModule = angular.module('geolocationModule', []);

require('./geolocation--directive')(geolocationModule);
require('./geolocation--service')(geolocationModule);

},{"./geolocation--directive":5,"./geolocation--service":6}],9:[function(require,module,exports){
'use strict';

var modalModule = angular.module('geolocationModalModule', []);

require('./modal--controller.js')(modalModule);
require('./modal-instance--controller.js')(modalModule);

},{"./modal--controller.js":10,"./modal-instance--controller.js":11}],10:[function(require,module,exports){
'use strict';

module.exports = function(ngModule) {

  ngModule.factory('geolocationModal', [
    '$modal',
    function($modal) {

        var service = {};
        service.open = function(size) {

          var geoOptions;

          return $modal.open({
            templateUrl: 'partials/modal.html',
            controller: 'modalInstanceController',
            size: size,
            resolve: {
              geoOptions: function () {
                return geoOptions;
              }
            }
          }).result;

      };

      return service;

  }]);

};

},{}],11:[function(require,module,exports){
'use strict';

module.exports = function(ngModule) {

  ngModule.controller('modalInstanceController', [
    '$scope',
    '$modalInstance',
    function($scope, $modalInstance){

      $scope.returnLocation = function (obj) {
        $modalInstance.close(obj);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

  }]);

};

},{}],12:[function(require,module,exports){
module.exports = function(ngModule) {

  ngModule.factory('resultsService', [function() {

    return {
      
    };

  }]);

};

},{}],13:[function(require,module,exports){
module.exports = function(ngModule) {

  ngModule.directive('result', [function() {

      var directive = {
        restrict: 'E',
        replace: false,
        templateUrl: '/templates/result.html',
        controllerAs: 'ctrl'
      };

      directive.link = function(scope, element, attrs) {
        scope.restaurant = scope.$eval(attrs.data);
      };

      return directive;

  }]);

  ngModule.run(['$templateCache', function($templateCache) {
    $templateCache.put('/templates/result.html',
    require('./../templates/result--template.html'));
  }]);

};

},{"./../templates/result--template.html":16}],14:[function(require,module,exports){
module.exports = function(ngModule) {

  ngModule.directive('results', [function() {

    var searchType, lastSearch,
    directive = {
      restrict: 'E',
      replace: false,
      scope: {},
      templateUrl: '/templates/results.html',
      controllerAs: 'ctrl'
    };

    directive.link = function(scope, element, attrs) {

      scope.results = [{
        url: '/'
      }];

      if (!lastSearch) {
        for (var i = 0; i < 20; i++) {
          scope.results.push({});
        }
      } else {
        scope.results = lastSearch;
      }

    };

    directive.controller = ['$rootScope', '$location', '$scope', 'Geosearch', 'Search', function($rootScope, $location, $scope, Geosearch, Search) {

      if (!lastSearch) {
        // should open modal
        $rootScope.getLocationButton();
      }

      $rootScope.$on('geosearchFire', function() {
        searchType = 'geosearch';
        $scope.results = Geosearch.results;
        lastSearch = Geosearch.results;
        if ($location.url() !== '/') {
          $location.url('/');
        }
      });

      $rootScope.$on('searchFire', function() {
        searchType = 'search';
        $scope.results = Search.results;
        lastSearch = Search.results;
        if ($location.url() !== '/') {
          $location.url('/');
        }
      });

      $scope.loadMore = function() {
        console.log("Clicked the button");
        if (searchType === 'search') {
          console.log('get more search results of that name?');
          $rootScope.$broadcast('moreSearch');

        } else if (searchType === 'geosearch') {
          console.log('get more search results around here.');
          $rootScope.$broadcast('moreGeosearch');
        }
      };

    }];

    return directive;

  }]);

  ngModule.run(['$templateCache', function($templateCache) {
    $templateCache.put('/templates/results.html',
      require('./../templates/results--template.html'));
  }]);

};

},{"./../templates/results--template.html":17}],15:[function(require,module,exports){
'use strict';

var resultsModule = angular.module('resultsModule', []);

require('./directives/results--directive.js')(resultsModule);
require('./directives/result--directive.js')(resultsModule);

},{"./directives/result--directive.js":13,"./directives/results--directive.js":14}],16:[function(require,module,exports){
module.exports = "<div ng-if=\"$index % 2 === 0\" class=\"col-xs-12 visible-sm clearfix\"></div>\n<div ng-if=\"$index % 3 === 0\" class=\"col-xs-12 visible-md visible-lg clearfix\"></div>\n\n<div class=\"list-container col-sm-6 col-md-4\">\n  <div class=\"card clearfix drop-shadow {{restaurant.score | scoreBorder}}\">\n    <a href=\"#{{restaurant.url}}\">\n      <div class=\"title clearfix\">\n        <i class=\"{{restaurant.category | categoryIcon }} col-xs-2 category-icon\"></i>\n        <ul class=\"col-xs-7 info\">\n          <li class=\"name\">{{restaurant.name}}</li>\n          <li class=\"address\">{{restaurant.address}}</li>\n        </ul>\n        <p class=\"score col-xs-3 {{restaurant.score | scoreColor}}\">{{restaurant.score}}</p>\n      </div>\n      <div class=\"inspections visible-md visible-lg\"></div>\n      <p class=\"readMore visible-sm visible-md visible-lg\">Read this vendor's full report.</p>\n    </a>\n  </div>\n</div>\n";

},{}],17:[function(require,module,exports){
module.exports = "<section id=\"results\">\n  <ul>\n    <li ng-repeat=\"result in results\">\n      <result data=\"result\"></result>\n    </li>\n    <li class=\"clearfix\"></li>\n\n    <li class=\"container load-more-button\" ng-show=\"true\">\n      <div class=\"row\">\n        <a class=\"col-xs-12\" ng-click=\"loadMore()\">Expand Search Radius</a>\n      </div>\n    </li>\n\n  </ul>\n</div>\n";

},{}],18:[function(require,module,exports){

},{}]},{},[1,2,4,5,6,8,9,10,11,12,13,14,15,18]);