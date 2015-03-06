angular.module('battleship')
.directive('gameBoardWidget', [function () {
   return {
    restrict: 'E',
    templateUrl: '/battleship/partials/gameBoard.html',
    replace: true, 
    scope: {
        player: '=',
        playerGrid: '=',
        playerShips: '=',
        attack: '&',
        playerReady: '&',
        hasWinner: '&',
        startComputerPlayer: '&'
    },
    link: function ($scope, $element, $attrs) {
        $scope.shipReady = false; 
        $scope.location = resetLocation();  

        // When leaving a ship location input field (row or col) 
        // it calls this onblur handler to place the ship on the 
        // grid 
        $scope.onblur = function (ship) {
            if (ship.row === null || 
                ship.col === null) {
                return;
            }
            ship.invalid = false; 
            var colEnd = ship.col + ship.size - 1;
            var cols = $scope.playerGrid[0].length - 1;
            if (colEnd > cols) {
                ship.invalid = true;
                alert('No spaces for the ship ' + ship.name + '(size: ' + ship.size + ')');
                return; 
            }
            var cell; 
            // If it's alredy on the grid, we clean up the old info and replace 
            // with the new 
            if (ship.addToBoard) { 
                resetBattleship(ship.name);
                ship.addToBoard = false; 
            }
            // Loop from starting column to the ending column to make sure nothing 
            // is in the way  
            for (var i = ship.col; i <= colEnd; i++) {
                cell = $scope.playerGrid[ship.row][i];
                if (cell.battleship !== null) {
                    alert('Ship ' + ship.name + ' overlaps ' + cell.battleship.name); 
                    ship.invalid = true; 
                    return;
                }
            }
            // Loop from starting column to the ending column again to make updates  
            for (var i = ship.col; i <= colEnd; i++) {
                cell = $scope.playerGrid[ship.row][i];
                cell.battleship = ship; 
            }  
            ship.addToBoard = true;
        };
        
        // Receive events from computer player to place ships on the grid 
        $scope.$on('fillBoardEvent', function (event, player, ship, last) {
            if ($scope.player !== player) {
                return;
            }
            $scope.onblur(ship); 
            if (last) {
                $scope.ready(); 
            }
        });
        
        // Receive events from computer player to issue an attack 
        $scope.$on('attackEvent', function (event, player, location) {
            if ($scope.player !== player) {
                return;
            }
            $scope.location = location;
            $scope.attackShip();
        });
        
        // Tell computer player, this directive is ready to receive 
        // events 
        $scope.startComputerPlayer({player: $scope.player});
        
        // Hide the ship locations input fields and show the attacking 
        // fileds 
        $scope.ready = function () {
            if (!$scope.ships.$valid || !shipsOnBoard()) {
                return;
            }
            $scope.player.ready = true; 
        };

        // When the "Attack" is pressed, this handler calls the "Attack" 
        // method in the controller 
        $scope.attackShip = function () {
            if (!$scope.ships.$valid) {
                return;
            } 
            $scope.attack({attacker: $scope.player, location: $scope.location});
            $scope.location = resetLocation();
        };
        
        // Setting the max attributes 
        $scope.getMaxRows = $scope.playerGrid.length - 1;
        $scope.getMaxCols = $scope.playerGrid[0].length - 1;
        
        // Return a list of sunk ships, so it can display which ships are 
        // detroyed 
        $scope.sunkShips = function() { 
            var sunks = []; 
            for (var i = 0; i < $scope.playerShips.length; i++) {
                if ($scope.playerShips[i].destroyed) {
                    sunks.push($scope.playerShips[i]);
                }
            }
            return sunks;
        }
        
        // After each attack, reset the location back to nulls 
        function resetLocation () { 
            return {row: null, col: null};
        }
        
        // Remove a battleship from the grid 
        function resetBattleship (name) {
            var cell; 
            var rows = $scope.playerGrid.length; 
            var cols = $scope.playerGrid[0].length; 
            for (var i = 0; i < rows; i++) { 
                for (var j = 0; j < cols; j++) { 
                    cell = $scope.playerGrid[i][j];
                    if (cell.battleship  && 
                        cell.battleship.name === name) {
                       cell.battleship = null; 
                    }
                }
            } 
        }
        
        // Check whether all ships are on the grid
        function shipsOnBoard () { 
            for (var i = 0; i < $scope.playerShips.length; i++) {
                if (!$scope.playerShips[i].addToBoard) {
                    return false; 
                }
            }
            return true;
        }
     }
   }
}]);