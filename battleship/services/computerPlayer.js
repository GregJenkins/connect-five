function computerPlayer () {
    var self = this;
    self.useComputerPlayer = true; 
 
    // Randomly select a row and place a ship on the row; one ship 
    // per row 
    self.fillBoard = function (playerGrid, playerShips, $scope, player) {
        if (!self.useComputerPlayer) {
            return;
        }
        var rows = playerGrid.length; 
        var cols = playerGrid[0].length; 
        if (playerShips.length > rows || 
            getMaxSize(playerShips) > cols) { 
            console.log('Unable to use a computer player'); 
            return;
        }
        var selectedPos = [];
        var len = playerShips.length;
        var loc, ship;  
        for (var i = 0; i < len; i++) {
            ship = playerShips[i];
            ship.row = randomPos(rows, selectedPos); 
            ship.col = Math.floor(Math.random() * (cols - ship.size));
            $scope.$root.$broadcast('fillBoardEvent', player, ship, (i === (len - 1)));
        }
    };
    
    // Randomly select a cell location and send out the attacking 
    // event 
    self.attack = function (playerGrid, $scope, player) {
        if (!self.useComputerPlayer) {
            return;
        }
        var rows = playerGrid.length; 
        var cols = playerGrid[0].length;
        var selectedPos = rowsAttacked(playerGrid); 
        if (selectedPos.length === rows) {
            console.log('Unable to find a grid position to attack'); 
            return;
        }
        var row = randomPos(rows, selectedPos); 
        selectedPos = colsAttacked(playerGrid, row); 
        var col = randomPos(cols, selectedPos);
        $scope.$root.$broadcast('attackEvent', player, {row: row, col: col});
    };
    
    // If the selected position has already been attacked, move the posotion 
    // left and right or up and down to find the next available position 
    function checkBothSides(arr, pos, max) {
        if (arr.length === 0) { 
            return pos;
        }
        var min = 0; 
        // check left (up) 
        for (var i = pos; i >= min; i--) { 
            if (arr.indexOf(i) === -1) {
                return i; 
            }
        }
        // check right (down)
        for (var i = pos; i <= max; i++) {
            if (arr.indexOf(i) === -1) {
                return i;
            }
        }
    }
    
    
    // Find a random position for a ship  
    function randomPos(max, selectedPos) { 
        var pos = Math.floor(Math.random() * max);
        pos = checkBothSides(selectedPos, pos, (max - 1)); 
        if (pos === undefined) {
            console.log('Unable to get a grid position'); 
        }
        else {
            selectedPos.push(pos);
        }
        return pos; 
    }
    
    // Get the max ship size to velidate ship location 
    function getMaxSize (playerShips) {
        var max = -1; 
        for (var i = 0; i < playerShips.lenght; i++) { 
            if (palyerShips[i].size > max) { 
                max = playerShips[i].size;
            }
        }
        return max; 
    }

    // Get a list of attacked rows - rows that don't contain any 
    // un-attacked cells 
    function rowsAttacked (playerGrid) {
        var rows = playerGrid.length; 
        var cols = playerGrid[0].length;
        var ret = [], i, j;
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                if (!playerGrid[i][j].attacked) {
                    break;
                }
            }
            if (j < cols) {
                continue;
            }
            else {
                ret.push(i);
            }
        }
        return ret; 
    }
    
    // Get a list of attacked cells in the selected row 
    function colsAttacked(playerGrid, row) {
        var cols = playerGrid[0].length;
        var ret = [];
        for (var i = 0; i < cols; i++) {
            if (playerGrid[row][i].attacked) {
                ret.push(i); 
            }
        }
        return ret; 
    }
    
}                