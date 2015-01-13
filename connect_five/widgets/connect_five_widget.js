angular.module('connectFive', ['playGame'])
.directive('tabs', [function() {
    return {
        restrict: 'E',
        transclude: true,
        template: '<ul class="nav nav-tabs">' + 
                  '<li ng-repeat="tab in tabs" ng-class="{active: tab.selected}">' + 
                  '<a href="" ng-click="selectTab(tab)" ng-bind="tab.name"></a>' + 
                  '</li>' + 
                  '</ul>' + 
                  '<div ng-transclude></div>',
        scope: true, 
        controller: function($scope) {
            $scope.tabs = new Array();
            $scope.selectedTab = null; 
            this.addToTabs = function(tab) {
                if ($scope.selectedTab === null)
                {
                    $scope.selectedTab = tab; 
                    tab.selected = true; 
                }
                $scope.tabs.push(tab); 
            };
            $scope.selectTab = function (tab) 
            {
                if ($scope.selectedTab != tab) 
                {
                    $scope.selectedTab.selected = false; 
                    tab.selected = true; 
                    $scope.selectedTab = tab; 
                }
            };
        }
    };
}])
.directive('tab', [function() { 
    return {
        restrict: 'E',
        scope: {
            htmlUrl: '@',
            name: '@' 
        },
        replace: true, 
        template: '<div class="tabContainer" ng-show="tab.selected" ng-include="htmlUrl"></div>',
        require: '^tabs', 
        link: function ($scope, $element, $attr, tabsCtrl) {
            $scope.tab = {name: $scope.name, selected: false}; 
            tabsCtrl.addToTabs($scope.tab); 
        }
    };
}]); 