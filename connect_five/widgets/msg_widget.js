angular.module('playGame')   
    .directive('msgWidget', [function() {
        return {
            restrict: 'A',
            template: '<span ng-class="getClassName()" ng-bind="msgObject.message"></span>',
            scope: {
                msgObject: '='
            },
            link: function ($scope, $element, $attrs) {
                $scope.msgObject.scope = $scope; 
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
                
                