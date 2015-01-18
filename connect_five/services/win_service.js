function winService()
{
    var minRow = 0, maxRow; 
    var minCol = 0, maxCol;  

    // Method to check for a winner with the current chip object 
    // and the game board cell objects  
    this.checkWin = function (currentChip, cells)
    {
        var color = currentChip.color; 
        var cell = currentChip.parent;
        maxRow = cells.length - 1; 
        maxCol = cells[0].length - 1; 
        var resultChips = [], temp;
        resultChips[0] = currentChip;
        // Is the current chip a part of five vertically connected chips?   
        resultChips = resultChips.concat(checkFiveChips(nextVertical, cells, color, cell));
        // Is the current chip a part of five horizontally connected chips?
        resultChips = resultChips.concat(checkFiveChips(nextHorizontal, cells, color, cell));
        // Is the current chip a part of five left-to-right diagonally connected chips?
        resultChips = resultChips.concat(checkFiveChips(nextDiagRight, cells, color, cell));
        // Is the current chip a part of five right-to-left diagonally connected chips?
        resultChips = resultChips.concat(checkFiveChips(nextDiagLeft, cells, color, cell));
        // It's rare to have more than five chips connected together, but handle it 
        // anyway 
        if (resultChips.length >= 5)
        {
            for (var i = 0; i < resultChips.length; i++)
            {
                resultChips[i].parent.winClass = true; 
                resultChips[i].parent.scope.$digest();
            }
            return true; 
        }
        return false; 
    }
        
    function checkFiveChips (func, cells, color, cell) 
    {
        var resultChips = [];
        // Check both directions 
        findChips(func, cells, color, {row: cell.row, col: cell.col}, resultChips, true);
        findChips(func, cells, color, {row: cell.row, col: cell.col}, resultChips, false);
        if (resultChips.length >= 4)
        {
            return resultChips; 
        }
        return [];
    }
    // Internal function to check four chips above (left) the current 
    // chip and four chips under (right) the current chip, and return 
    // all the same color and connected chips found 
    function findChips(func, cells, color, currentPos, resultChips, flag)
    {
        var chip; 
        for (var i = 0; i < 4; i++)
        {
            currentPos = func(currentPos, flag);
            if (currentPos == null)
            {
                break;
            }
            chip = getChip(cells, currentPos);
            if ((chip != null) && (chip.color == color))
            {
                resultChips[resultChips.length] = chip; 
            }
            else 
            {
                break;
            }
        }
    }   
    
    // Use position to find a cell object in the game 
    // board cells array and return its chip object.
    // It returns null if there is no chip in the cell 
    function getChip(cells, pos)
    {
        cell = cells[pos.row][pos.col]; 
        return cell.chip; 
    }
    
    // Get the position of next chip vertically 
    function nextVertical(currentPos, up)
    { 
        if (up)
        {
            currentPos.row--; 
        }
        else 
        {
            currentPos.row++;
        }
        if ((currentPos.row < minRow) || (currentPos.row > maxRow))
        {
            return null;
        }
        return currentPos; 
    }
    
    // Get the position of next chip horizontally 
    function nextHorizontal(currentPos, left)
    { 
        if (left)
        {
            currentPos.col--; 
        }
        else 
        {
            currentPos.col++;
        }
        if ((currentPos.col < minCol) || (currentPos.col > maxCol))
        {
            return null;
        }
        return currentPos; 
    }    
    
    // Get the position of next chip left-to-right diagonally 
    function nextDiagRight(currentPos, up)
    { 
        if (up)
        {
            currentPos.row--; 
            currentPos.col--; 
        }
        else 
        {
            currentPos.row++;
            currentPos.col++;
        }
        if ((currentPos.col < minCol) || (currentPos.col > maxCol) ||
            (currentPos.row < minRow) || (currentPos.row > maxRow))
        {
            return null;
        }
        return currentPos; 
    } 
    
    // Get the position of next chip right-to-left diagonally 
    function nextDiagLeft(currentPos, up)
    { 
        if (up)
        {
            currentPos.row--; 
            currentPos.col++; 
        }
        else 
        {
            currentPos.row++;
            currentPos.col--;
        }
        if ((currentPos.col < minCol) || (currentPos.col > maxCol) ||
            (currentPos.row < minRow) || (currentPos.row > maxRow))
        {
            return null;
        }
        return currentPos; 
    }
}