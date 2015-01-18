
function gameSetupService ()
{  
    var boardGameValues = null; 
    var currentChip = {
        // Show the demo link if no chips are on 
        // the board and it's demo-able 
        showDemo: function () { 
            return ((this.chip === null) && 
                    boardGameValues.isDemoAble())
        }
    }; 
    var msgObject = {scope: null};
    var demoObject = {scope: null};
    
    // Set the default values of the message, currentChip, and 
    // demo objects
    function initObjects() {
        currentChip.chip = null;
        currentChip.win = false; 
        msgObject.message = 'Play Game!!!!';
        msgObject.animate = false;
        demoObject.inProg = false; 
    }
    
    // Create all the game objects 
    this.createBoardAndChips = function(BGValues)
    {
        boardGameValues = BGValues;
        var numberOfChips = boardGameValues.numberOfChips; 
        var numberOfRows = boardGameValues.numberOfRows; 
        var numberOfCols = boardGameValues.numberOfCols; 
        initObjects(); 
        var blackChips = [];
        var whiteChips = [];
        for (var i = 0; i < numberOfChips; i++)
        {
            blackChips[i] = new gameChip('black', i);
            whiteChips[i] = new gameChip('white', i);
        }
        var cells = [];
        for (var row = 0; row < numberOfRows; row++)
        {
            cells[row] = []; 
            for (var col = 0; col < numberOfCols; col++)
            {
                cells[row][col] = new gameCell(row, col);  
            }
        }
        return {blackChips: blackChips, whiteChips: whiteChips, 
                cells: cells, currentChip: currentChip, 
                msgObject: msgObject, demoObject: demoObject}; 
    };
    
    // Instead of recreating all the cells and chips, we only reset cells and 
    // chips that have been used. This dramatically improves the performance 
    // of calling newGame() on IE11.
    this.resetBoardAndChips = function (cells, blackChips, whiteChips) 
    {
        // Reset objects of which refrences are held by the "boardGame"
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
                    // Send an event to the "chipWidget" directive to return 
                    // the chip to it's pot 
                    chip.scope.$emit('resetChipState', chip.color); 
                }
            }
        }
    };     
    
    // Game chip object constructor 
    function gameChip (color, index)
    {
        this.color = color; 
        this.id = this.color + '_' + index;
        this.draggable = 'true'; 
        this.parent = null; 
        this.scope = null;

    }
    
    // Prototype methods for gameChip shared by all objects
    
    // Generate a random position for a chip in a pot  
    gameChip.prototype.getChipPotPos = function () {
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
    
    // Is a chip in a pot? 
    gameChip.prototype.inPot = function () { 
        return (this.parent === null);
    };
        
    // Is a chip the current chip? 
    gameChip.prototype.isCurrent = function () {
        return (!currentChip.win && 
                (this === currentChip.chip));
    };
    
    // Is a chip in demo mode? 
    gameChip.prototype.isDemo = function() {
        return demoObject.inProg;
    };
    
    // Is it the correct turn to play this color chip? 
    gameChip.prototype.isMyTurn = function () {
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
    
    // Game cell constructor 
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