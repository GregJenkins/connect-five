angular.module('playGame')   
    .directive('chipWidget', [function() {
        return {
            restrict: 'A',
            // Create template to use isolate scope and call $digest() in 
            // the isolate scope to only update bindings for a single chip 
            template: '<div ng-class="getClassName()" draggable="{{chipData.draggable}}"></div>',
            replace: true,
            scope: {
                chipData: '='
            },
            link: function ($scope, $element, $attrs) {
                // Save $scope with the chip object, so can call 
                // $digest() for a single chip 
                $scope.chipData.scope = $scope;
                function setChipPos ()
                {
                    var pos = $scope.chipData.getChipPotPos(); 
                    $element.css('top', pos.top + 'px');
                    $element.css('left', pos.left + 'px');
                }
                setChipPos(); 
                $element.bind('dragstart', function (event) {
                    if (($scope.chipData.inPot() && 
                         !$scope.chipData.isMyTurn()) ||
                        $scope.chipData.isDemo())
                    {
                        event.dataTransfer.effectAllowed = 'none'; 
                    }
                    event.dataTransfer.setData('Text', $scope.chipData.id);
                });   
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
                $scope.cellData.scope = $scope; 
                $element.css('width', $scope.cellData.width + 'px'); 
                $element.css('height', $scope.cellData.height + 'px');
                $element.bind ('dragover', function (event) {
                    event.preventDefault();
                });
                
                $scope.$on('makeMoveEvent', 
                           function (event, chip) { 
                               $timeout(function () {
                                            moveChipToCell(chip);
                                        }, 0, false); 
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
                    var chipEle = document.getElementById(chip.id);
                    $element.append(chipEle);
                    // Save the previous cell, so if it's moving from a 
                    // cell to the other, we can set the chip value of 
                    // previous cell to null in setCurrentChip() to 
                    // indicate that the previous cell contains no chip 
                    var prevParent = chip.parent;  
                    $scope.cellData.chip = chip;
                    chip.parent = $scope.cellData;
                    $scope.setCurrentChip({chip: chip, prevParent: prevParent}); 
                }
                
                $element.bind('drop', function (event) {
                    if ($scope.cellData.chip == null)
                    {
                        var chipId = event.dataTransfer.getData('Text');
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