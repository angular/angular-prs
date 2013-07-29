'use strict';

angular.module('angularPrsApp')
  .controller('MainCtrl', function ($scope, github, dateFilter) {
      var dates = {},
          dayTimeSeries = [],
          weekTimeSeries = [],
          processedPrs = {},
          previousDateInfo = {pendingCount: 0};

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


        console.log('creating day time series...');

        Object.keys(dates).sort().forEach(function(date) {
          var dateInfo = dates[date];
          dateInfo.date = date;
          dateInfo.createdCount = dateInfo.createdCount || 0;
          dateInfo.closedCount = dateInfo.closedCount || 0;
          dateInfo.pendingCount = previousDateInfo.pendingCount + dateInfo.createdCount - dateInfo.closedCount;
          dayTimeSeries.push(dateInfo);

          previousDateInfo = dateInfo;
        });


        console.log('creating week time series...');

        var weeks = {};
        var weekStart;
        var weekEndTime = 0;
        var weekInfo;
        var previousWeekInfo = {pendingCount: 0};
        var timeZoneOffset = new Date().getTimezoneOffset()*60*1000;

        Object.keys(dates).sort().forEach(function(date) {
          var dateInfo = dates[date];

          if (new Date(date).getTime() <= weekEndTime) {
            weekInfo.createdCount += dateInfo.createdCount;
            weekInfo.closedCount += dateInfo.closedCount;
          } else {
            if (weekStart) {
              weekStart = dateFilter(weekEndTime + 1 + timeZoneOffset, "yyyy-MM-dd");
            } else {
              weekStart = date;
            }
            weekEndTime = new Date(weekStart).getTime() + 7*24*60*60*1000;

            weekInfo = {
              createdCount: dateInfo.createdCount,
              closedCount: dateInfo.closedCount
            };
            weeks[weekStart] = weekInfo;
          }
        });


        Object.keys(weeks).sort().forEach(function(weekStart) {
          var weekInfo = weeks[weekStart];
          weekInfo.date = weekStart;
          weekInfo.createdCount = weekInfo.createdCount || 0;
          weekInfo.closedCount = weekInfo.closedCount || 0;
          weekInfo.pendingCount = previousWeekInfo.pendingCount + weekInfo.createdCount - weekInfo.closedCount;
          weekTimeSeries.push(weekInfo);

          previousWeekInfo = weekInfo;
        });


        console.log('rendering...');

        $scope.dayTimeSeries = dayTimeSeries;
        $scope.weekTimeSeries = weekTimeSeries;
      });
  });
