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