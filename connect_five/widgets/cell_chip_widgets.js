angular.module('connectFive')   
    .directive('chipWidget', ['connectionService', function(connectionService) {
        return {
            restrict: 'A',
            // Create template to use the isolate scope and call $digest() in 
            // the isolate scope to only update the UI for a single chip 
            template: '<div ng-class="getClassName()" draggable="{{chipData.draggable}}"></div>',
            replace: true,
            scope: {
                chipData: '='
            },
            link: function ($scope, $element, $attrs) {
                // Save $scope with the chip object, so it can call 
                // $digest() for a single chip 
                $scope.chipData.scope = $scope;
                // Internal function to set chip location in a pot 
                function setChipPos ()
                {
                    var pos = $scope.chipData.getChipPotPos(); 
                    $element.css('top', pos.top + 'px');
                    $element.css('left', pos.left + 'px');
                }
                setChipPos();
                // Event handler for dragging a chip    
                $element.bind('dragstart', function (event) {
                    if (($scope.chipData.inPot() && 
                         !$scope.chipData.isMyTurn()) ||
                        $scope.chipData.isDemo() || 
                        connectionService.forbidThisChip($scope.chipData.color))
                    {
                        event.dataTransfer.effectAllowed = 'none'; 
                    }
                    event.dataTransfer.setData('Text', $scope.chipData.id);
                });   
                // Method to set the CSS styles for a chip 
                $scope.getClassName = function() {
                    var obj = {};
                    obj[$scope.chipData.color] = true; 
                    obj.piece = true;
                    if ($scope.chipData.isCurrent())
                    {
                        obj.current = true; 
                    }
                    if ($scope.chipData.inPot())
                    {
                        obj.inPot = true; 
                    }
                    return obj;
                };
                // Event handler to return a chip to it's pot 
                $scope.$on('resetChipState', 
                          function (event, color) {
                              var potId = color + 'Pot'; 
                              var potEle = document.getElementById(potId); 
                              angular.element(potEle).append($element);
                              setChipPos(); 
                              event.stopPropagation(); 
                          }); 
            }
        };
    }])
    .directive('cellWidget', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            template: '<td ng-class="{boardColumn: true, winner: cellData.winClass}"></td>',
            replace: true, 
            scope: {
                cellData: '=',
                setCurrentChip: '&',
                getChip: '&'
            },
            link: function ($scope, $element, $attrs) {
                // Save the cell scope in the cell object  
                $scope.cellData.scope = $scope;
                // Set cell width and height 
                $element.css('width', $scope.cellData.width + 'px'); 
                $element.css('height', $scope.cellData.height + 'px');
                // Event handler to specify where a chip can be dropped. 
                // By default, no drop is allowed, so it calls 
                // preventDefault() to allow dropping a chip in a cell  
                $element.bind ('dragover', function (event) {
                    event.preventDefault();
                });
                // Event handler to move a chip to a cell  
                $scope.$on('makeMoveEvent', 
                           function (event, chip) { 
                               moveChipToCell(chip);
                               event.stopPropagation(); 
                           }); 
                
                function moveChipToCell (chip)
                {
                    if ((chip.inPot() && !chip.isMyTurn()) ||
                        (chip.parent == $scope.cellData))
                    {
                        return; 
                    }
                    /* Uncomment this code for logging moves  
                    console.log("{row: " + $scope.cellData.row + 
                                ", col: " + $scope.cellData.col +
                                ", color: '" + chip.color + "'}");
                    */
                    // Adding a chip element to a cell element will 
                    // remove the chip element from the pot element 
                    var chipEle = document.getElementById(chip.id);
                    $element.append(chipEle);
                    // Save the previous cell, so if it's moving from a 
                    // cell to another cell, we can set the chip value of 
                    // the previous cell to null in setCurrentChip() to 
                    // indicate that the previous cell contains no chip 
                    var prevParent = chip.parent;  
                    $scope.cellData.chip = chip;
                    chip.parent = $scope.cellData;
                    $scope.setCurrentChip({chip: chip, prevParent: prevParent}); 
                }
                
                // This event handler is called when a chip is dropped in a cell  
                $element.bind('drop', function (event) {
                    if ($scope.cellData.chip == null)
                    {
                        var chipId = event.dataTransfer.getData('Text');
                        // A quick check to make sure its a chip id 
                        if (chipId.match(/(black|white)_\d+/gi) == null)
                        {
                            return;
                        }
                        var chip = $scope.getChip({chipId: chipId});
                        moveChipToCell(chip); 
                    }
                });
            }
        };
    }])