'use strict';

angular.module('angularPrsApp')
  .service('github', function Github($http, $q, $location) {

    this.openPrs = function() {
      return fetchPages('open', 2);
    };


    this.closedPrs = function() {
      return fetchPages('closed', 50);
    };


    this.prs = function() {
      return $q.all([this.openPrs(), this.closedPrs()]).then(function(results) {
        var pulls = [];

        results.forEach(function(result) {
          pulls = pulls.concat(result);
        });

        return pulls;
      });
    };


    function fetchPages(state, lastPage) {
      var responsePromises = [];
      var prs = [];

      for (var i = 1; i <= lastPage; i++) {
        responsePromises.push($http.get('data/pulls-' + state + '/pulls-page-' + i + '.json'));
      }

      return $q.all(responsePromises).then(function (responses) {
        responses.forEach(function(response) {
          prs = prs.concat(response.data);
        });
        return prs;
      });
    }
  });
