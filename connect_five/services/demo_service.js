function demoService ()
{
    var moves = [{row: 9, col: 18, color: 'black'},
                 {row: 9, col: 19, color: 'white'},
                 {row: 8, col: 17, color: 'black'},
                 {row: 7, col: 16, color: 'white'},
                 {row: 9, col: 17, color: 'black'},
                 {row: 10, col: 17, color: 'white'},
                 {row: 9, col: 16, color: 'black'},
                 {row: 10, col: 15, color: 'white'},
                 {row: 10, col: 16, color: 'black'},
                 {row: 8, col: 18, color: 'white'},
                 {row: 7, col: 17, color: 'black'},
                 {row: 6, col: 17, color: 'white'},
                 {row: 8, col: 15, color: 'black'},
                 {row: 9, col: 15, color: 'white'},
                 {row: 7, col: 14, color: 'black'},
                 {row: 6, col: 13, color: 'white'},
                 {row: 8, col: 14, color: 'black'},
                 {row: 8, col: 13, color: 'white'},
                 {row: 9, col: 13, color: 'black'},
                 {row: 7, col: 12, color: 'white'},
                 {row: 9, col: 14, color: 'black'},
                 {row: 6, col: 14, color: 'white'},
                 {row: 10, col: 14, color: 'black'},
                 {row: 11, col: 14, color: 'white'},
                 {row: 11, col: 15, color: 'black'},
                 {row: 8, col: 12, color: 'white'},
                 {row: 12, col: 16, color: 'black'},
                 {row: 13, col: 17, color: 'white'},
                 {row: 11, col: 16, color: 'black'},
                 {row: 13, col: 16, color: 'white'},
                 {row: 8, col: 16, color: 'black'}]; 
    var index, blackIdx, whiteIdx, demo; 
    
    this.startDemo = function(cells, $timeout, blackChips, whiteChips, demoObject)
    {
        index = 0; 
        blackIdx = 0;
        whiteIdx = 0;
        demo = demoObject; 
        demo.inProg = true; 
        sendMoveEvent(cells, $timeout, blackChips, whiteChips);
    }
    
    function sendMoveEvent (cells, $timeout, blackChips, whiteChips)
    {
        var move = moves[index++];
        var chip, cell; 
        if (move.color == "black") 
        {
            chip = blackChips[blackIdx++]; 
        }
        else 
        {
            chip = whiteChips[whiteIdx++];
        }
        cell = cells[move.row][move.col]; 
        cell.scope.$emit("makeMoveEvent", chip);
        if (index < moves.length)
        {
            $timeout(function () {
                      sendMoveEvent (cells, $timeout, blackChips, whiteChips);
                     }, 1000, false);  
        }
        else 
        {
            $timeout(function() {
                        demo.inProg = false; 
                     }, 0, false);
        }
    };
} 