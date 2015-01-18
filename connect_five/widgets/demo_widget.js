angular.module('connectFive')
.directive('demoWidget', [function() {
    return {
        restrict: 'A',
        // Allow to hide and show the demo link 
        template: '<a ng-show="currentChip.showDemo()">Demo</a>',
        replace: true, 
        scope: {
            currentChip: '=',
            demoObject: '='
        }, 
        link: function ($scope, $element, $attrs) {
            $scope.demoObject.scope = $scope; 
        }
    }; 
}]);