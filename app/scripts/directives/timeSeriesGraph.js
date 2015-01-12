'use strict';

/* global d3 */

angular.module('angularPrsApp')

.directive('timeSeriesGraph', function () {
  return {
    restrict: 'E',
    scope: {
      timeSeries: '=',
      start: '=',
      end: '='
    },
    link: function postLink($scope, $element) {

      function updateChart() {

        var timeSeries = $scope.timeSeries;
        if (!timeSeries) {
          return;
        }

        var start = ($scope.start || 0)*$scope.timeSeries.length/1000;
        var end = ($scope.end || 1000)*$scope.timeSeries.length/1000;


        var data = angular.copy(timeSeries);
        data = data.splice(start, end);

        var margin = {top: 20, right: 80, bottom: 30, left: 50},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

        var parseDate = d3.time.format('%Y-%m-%d').parse;

        var x = d3.time.scale()
          .range([0, width]);

        var y = d3.scale.linear()
          .range([height, 0]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient('left');

        var line = d3.svg.line()
          .interpolate('basis')
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.count); });

        $element.empty();
        var svg = d3.select($element[0]).append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== 'date' && key.charAt(0) !== '$'; }));

        data.forEach(function(d) {
          d.date = parseDate(d.date);
        });

        var counts = color.domain().map(function(name) {
          return {
            name: name,
            values: data.map(function(d) {
              return {date: d.date, count: +d[name]};
            })
          };
        });

        x.domain(d3.extent(data, function(d) { return d.date; }));

        y.domain([
          d3.min(counts, function(c) { return d3.min(c.values, function(v) { return v.count; }); }),
          d3.max(counts, function(c) { return d3.max(c.values, function(v) { return v.count; }); })
        ]);

        svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);

        svg.append('g')
          .attr('class', 'y axis')
          .call(yAxis)
          .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', 6)
          .attr('dy', '.71em')
          .style('text-anchor', 'end')
          .text('Count');

        var count = svg.selectAll('.count')
          .data(counts)
          .enter().append('g')
          .attr('class', 'city');

        count.append('path')
          .attr('class', 'line')
          .attr('d', function(d) { return line(d.values); })
          .style('stroke', function(d) { return color(d.name); });

        count.append('text')
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
          .attr('transform', function(d) { return 'translate(' + x(d.value.date) + ',' + y(d.value.count) + ')'; })
          .attr('x', 3)
          .attr('dy', '.35em')
          .text(function(d) { return d.name.replace('Count', ''); });
      }

      $scope.$watch('start', updateChart);
      $scope.$watch('end', updateChart);
      $scope.$watch('timeSeries', updateChart);
    }
  };
});