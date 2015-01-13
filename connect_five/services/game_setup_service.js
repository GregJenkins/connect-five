
function gameSetupService ()
{  
    var currentChip = {}; 
    var msgObject = {scope: null};
    var demoObject = {scope: null};
    
    function initObjects() {
        currentChip.chip = null;
        currentChip.win = false; 
        msgObject.message = 'Play Game!!!!';
        msgObject.animate = false;
        demoObject.inProg = false; 
    }
    
    this.createBoardAndChips = function(numberOfChips, 
                                        numberOfRows, numberOfCols)
    {
        initObjects(); 
        var blackChips = new Array(numberOfChips);
        var whiteChips = new Array(numberOfChips);
        for (var i = 0; i < numberOfChips; i++)
        {
            blackChips[i] = new gameChip('black', i);
            whiteChips[i] = new gameChip('white', i);
        }
        var cells = new Array(numberOfRows);
        for (var row = 0; row < numberOfRows; row++)
        {
            cells[row] = new Array(numberOfCols); 
            for (var col = 0; col < numberOfCols; col++)
            {
                cells[row][col] = new gameCell(row, col);  
            }
        }
        return {blackChips: blackChips, whiteChips: whiteChips, 
                cells: cells, currentChip: currentChip, 
                msgObject: msgObject, demoObject: demoObject}; 
    };
    
    // Instead of recreating all cells and chips, we only reset cells and 
    // chips that have been used. This dramatically improved the performance 
    // of calling newGame() on IE11.
    this.resetBoardAndChips = function (cells, blackChips, whiteChips) 
    {
        // Reset objects of which refrences are held by the playGame
        // controller 
        initObjects(); 
        var cell, chip; 
        for (var i = 0; i < cells.length; i++)
        {
            for (var j = 0; j < cells[0].length; j++)
            {
                cell = cells[i][j]; 
                if (cell.chip != null) 
                {
                    chip = cell.chip; 
                    chip.draggable = 'true'; 
                    chip.parent = null; 
                    cell.winClass = false;
                    cell.chip = null; 
                    chip.scope.$emit('resetChipState', chip.color); 
                }
            }
        }
    };     
    
    function gameChip (color, index)
    {
        this.color = color; 
        this.id = this.color + '_' + index;
        this.draggable = 'true'; 
        this.parent = null; 
        this.scope = null;
        this.getChipPotPos = function () {
            var left = Math.floor((Math.random() * 80) + 1);
            var top = Math.floor((Math.random() * 80) + 1); 
            if ((left < 20) || (left > 60))
            {
                while ((top < 20) || (top > 60)) 
                {
                    top = Math.floor((Math.random() * 80) + 1);
                }
            }
            return {left: left, top: top};
        };
        this.inPot = function () { 
            return (this.parent === null);
        };
        this.isCurrent = function () {
            return (!currentChip.win && 
                    (this === currentChip.chip));
        };
        this.isDemo = function() {
            return demoObject.inProg;
        };
        this.isMyTurn = function () {
            if (!currentChip.win)
            {
                if ((currentChip.chip == null) || 
                    (currentChip.chip.color != this.color))
                {
                    return true; 
                }
            }
            return false;  
        };
    }
    
    function gameCell (row, col) {
        this.row = row; 
        this.col = col;
        this.chip = null;
        this.id = 'cell_' + row + '_' + col;
        this.winClass = false;
        this.scope = null; 
        this.width = 20; 
        this.height = 20; 
    }
}