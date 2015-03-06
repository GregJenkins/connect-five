angular.module('battleship', [])
.service('playerGridService', [playerGridService])
.service('shipService', [shipService])
.service('computerPlayer', [computerPlayer])
.controller('battleshipCtrl', ['$scope', 'playerGridService', 'shipService', 
                               'computerPlayer', '$timeout',
                               function($scope, playerGridService, shipService, 
                                         computerPlayer, $timeout) { 
    var self = this;
    // Grid size and ship info.  
    self.gridSize = {rows: 10, cols: 10};
    self.ships = [{name: 'Patrol Boat', size: 2},
                  {name: 'Destroyer', size: 3},
                  {name: 'Submarine', size: 3},
                  {name: 'Battleship', size: 4},
                  {name: 'Aircraft Carrier', size: 5}];
                                   
    // Create player objects and grid arrays for two players              
    var gridData = playerGridService.createPlayerGrid(self.gridSize, 'Player One');
    self.playerGrid1 = gridData.playerGrid; 
    self.player1 = gridData.player; 
    self.player1.turn = true; 
    gridData = playerGridService.createPlayerGrid(self.gridSize, 'Player Two');
    self.playerGrid2 = gridData.playerGrid; 
    self.player2 = gridData.player; 
    
    // Create ship arrays                                
    self.playerShips1 = shipService.createShips(self.ships);
    self.playerShips2 = shipService.createShips(self.ships);
    
    // Uncomment the following line to disable computer player                               
    // computerPlayer.useComputerPlayer = false;  
     
    // Computer player sends events to the gameBoardWidget directive to place 
    // ships on board and to attack. We create this method for the 
    // gameBoardWidget directive to call, so the computer player can start 
    // sending events after the gameBoardWidget directive is ready. 
    self.startComputerPlayer = function (player) {
        if (player === self.player2) {
            $timeout(function () { 
                computerPlayer.fillBoard(self.playerGrid2, self.playerShips2, $scope, self.player2);
            }, 0);
        }
    };
                
    // Allow player to use the "Attack" button after both players are ready                                
    self.playerReady = function () {
        return (self.player1.ready &&
                self.player2.ready);
    };
    
    // Disable both "Attack" button when there is a winner 
    self.hasWinner = function() {
        return (self.player1.win || 
                self.player2.win);
    };
    
    // This method gets called when the "Attack" button is pressed. It updates 
    // the cell info and switch to different user  
    self.attack = function (attacker, location) { 
        var playerGrid = (attacker === self.player1 ? self.playerGrid2 : self.playerGrid1); 
        var row = location.row;
        var col = location.col;
        cell = playerGrid[row][col]; 
        if (cell.attacked) {
            alert('This location is already attacked (row: ' + row + ' col: ' + col + ')'); 
            return; 
        }
        cell.attacked = true; 
        if (cell.battleship !== null) {
            cell.battleship.attacked();
            checkWinner(attacker);
        }     
        switchPlayer(attacker);
        return; 
    };
    
    // Switch to a different user and if it's player2's turn, it also 
    // calls the computer player's method to attack 
    function switchPlayer (attacker) {
        if (self.player1 === attacker) {
            self.player1.turn = false;
            self.player2.turn = true; 
            computerPlayer.attack(self.playerGrid1, $scope, self.player2); 
        }
        else {
            self.player1.turn = true;
            self.player2.turn = false;
        }
    };
    
    // Check for a winner and display winning message if there is a winner                              
    function checkWinner(attacker) {
        var playerShips = (attacker === self.player1 ? self.playerShips2 : self.playerShips1); 
        for (var i = 0; i < playerShips.length; i++) {
            if (!playerShips[i].destroyed) {
                return;
            }
        }
        attacker.win = true;
        attacker.name = attacker.name + " Wins!!!"; 
    }
}]);    
