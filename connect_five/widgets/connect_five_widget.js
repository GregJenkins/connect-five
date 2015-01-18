angular.module('connectFive', ['ngAnimate'])
.directive('tabs', [function() {
    return {
        restrict: 'E',
        transclude: true,
        // Display tabs on top and place the tab HTML code inside the "tabs" 
        // tag under tabs  
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
            // Method for the "tab" directive to call to 
            // save a tab object in the tabs array 
            this.addToTabs = function(tab) {
                if ($scope.selectedTab === null)
                {
                    $scope.selectedTab = tab; 
                    tab.selected = true; 
                }
                $scope.tabs.push(tab); 
            };
            // Method to call when a tab is selected. Selecting a 
            // tab calls $apply(), so we just need to set values 
            // and let AngularJS update the UI 
            $scope.selectTab = function (tab) 
            {
                if ($scope.selectedTab != tab) 
                {
                    $scope.selectedTab.selected = false; 
                    tab.selected = true; 
                    $scope.selectedTab = tab; 
                }
            };
            // Event handeler to select a tab programatically
            $scope.$on('selectTabEvent', function (event, index) {
                if (index < $scope.tabs.length)
                {
                    var tab = $scope.tabs[index];
                    $scope.selectTab(tab); 
                }
            });       
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
            // Create a tab object and add it to the tabs array in 
            // the "tabs" directive
            $scope.tab = {name: $scope.name, selected: false}; 
            tabsCtrl.addToTabs($scope.tab); 
        }
    };
}]); 