function playerGridService () {
    var self = this; 
    // Create an array to save cell data 
    self.createPlayerGrid = function(gridSize, playerName) {
        var player = {name: playerName, turn: false, 
                      win: false, ready: false, 
                      result: ''}; 
        var rows = gridSize.rows; 
        var cols = gridSize.cols;
        var playerGrid = [];
        for (var i = 0; i < rows; i++) { 
            playerGrid[i] = [];
            for (var j = 0; j < cols; j++) { 
                playerGrid[i][j] = new Cell(i, j); 
            }
        }
        return {player: player, playerGrid: playerGrid}; 
    };
        
    function Cell (row, col) {
        this.battleship = null; 
        this.row = row; 
        this.col = col; 
        this.attacked = false; 
    }
    Cell.prototype.getClassName = function () {
        return {cell: true, 
                battleship: (this.battleship !== null) };
    };
}