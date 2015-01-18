angular.module('connectFive')   
    .directive('msgWidget', [function() {
        return {
            restrict: 'A',
            template: '<span ng-class="getClassName()" ng-bind="msgObject.message"></span>',
            scope: {
                msgObject: '='
            },
            link: function ($scope, $element, $attrs) {
                $scope.msgObject.scope = $scope; 
                // Set the animation CSS style 
                $scope.getClassName = function() {
                    if ($scope.msgObject.animate)
                    {
                        return "msg-animate";
                    }
                    return "";
                };  
            }
        }
    }]);
                
                