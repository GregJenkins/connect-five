function winService()
{
    var minRow = 0, maxRow; 
    var minCol = 0, maxCol;  

    this.checkWin = function (currentChip, cells)
    {
        var color = currentChip.color; 
        var cell = currentChip.parent;
        maxRow = cells.length - 1; 
        maxCol = cells[0].length - 1; 
        var resultChips = new Array(), temp;
        resultChips[0] = currentChip; 
        resultChips = resultChips.concat(checkFiveChips(nextVertical, cells, color, cell));
        resultChips = resultChips.concat(checkFiveChips(nextHorizontal, cells, color, cell));
        resultChips = resultChips.concat(checkFiveChips(nextDiagRight, cells, color, cell));
        resultChips = resultChips.concat(checkFiveChips(nextDiagLeft, cells, color, cell)); 
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
        var resultChips = new Array(); 
        findChips(func, cells, color, {row: cell.row, col: cell.col}, resultChips, true);
        findChips(func, cells, color, {row: cell.row, col: cell.col}, resultChips, false);
        if (resultChips.length >= 4)
        {
            return resultChips; 
        }
        return [];
    }
    function findChips(func, cells, color,currentPos, resultChips, flag)
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
        
    function getChip(cells, pos)
    {
        cell = cells[pos.row][pos.col]; 
        return cell.chip; 
    }
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