'use strict';

describe('Directive: timeSeriesGraph', function () {
  beforeEach(module('ngPullDashboardApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<time-series-graph></time-series-graph>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the timeSeriesGraph directive');
  }));
});
