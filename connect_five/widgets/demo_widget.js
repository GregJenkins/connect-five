angular.module('playGame')
.directive('demoWidget', [function() {
    return {
        restrict: 'A',
        template: '<a ng-show="currentChip.chip === null">Demo</a>',
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