'use strict';

angular.module('ngPullDashboardApp')
  .controller('MainCtrl', function ($scope, github) {
      var dates = {},
          timeSeries = [],
          processedPrs = {},
          previousDateInfo = {openCount: 0};

      console.log('loading data...');

      github.prs().then(function(prs) {
        console.log('counting...');

        prs.forEach(function(pr) {
          var date, dateInfo;

          if (processedPrs[pr.number]) {
            console.error('Found duplicate PR: ', pr);
          }

          processedPrs[pr.number] = true;

          date = pr.created_at.split('T')[0];
          dateInfo = dates[date] = dates[date] || {};
          dateInfo.createdCount = (dateInfo.createdCount || 0) + 1;

          if (pr.closed_at) {
            date = pr.closed_at.split('T')[0];
            dateInfo = dates[date] = dates[date] || {};
            dateInfo.closedCount = (dateInfo.closedCount || 0) + 1;
          }
        });


        console.log('creating time series...');


        Object.keys(dates).sort().forEach(function(date) {
          var dateInfo = dates[date];
          dateInfo.date = date;
          dateInfo.openCount = previousDateInfo.openCount + (dateInfo.createdCount || 0) - (dateInfo.closedCount || 0);
          timeSeries.push(dates[date]);

          previousDateInfo = dateInfo;
        });

        console.log('rendering...');

        $scope.timeSeries = timeSeries;
      });
  });
