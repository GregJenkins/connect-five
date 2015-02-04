function demoService ()
{
    // Game moves recorded with the code in the "cellWidget" directive 
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

    // Method to start the demo 
    this.startDemo = function(cells, $timeout, blackChips, whiteChips, demoObject)
    {
        index = 0; 
        blackIdx = 0;
        whiteIdx = 0;
        demo = demoObject; 
        demo.inProg = true;
        // Send "move" events to the "cellWidget" directive.  
        // To avoid this error: 
        //      "Error: [$rootScope:inprog] $apply already in progress"
        // use $timeout to send out the first "move" event. 
        // Clicking on the demo link calls $apply() to run startDemo() 
        // inside $apply(). Without $timeout, the "move" event ends up 
        // calling $digest() after placing a chip on the game board and 
        // since $apply() also calls $digest(), it displays this error 
        // in the browser console.
        $timeout(function() { 
            sendMoveEvent(cells, $timeout, blackChips, whiteChips);
        }, 0, false); 
    }
    
    function sendMoveEvent (cells, $timeout, blackChips, whiteChips)
    {
        // Get next move from the moves array  
        var move = moves[index++];
        var chip, cell; 
        // Use the color to get next black or white chip object  
        if (move.color == "black") 
        {
            chip = blackChips[blackIdx++]; 
        }
        else 
        {
            chip = whiteChips[whiteIdx++];
        }
        // Get the cell object of the cell in which the next chip 
        // will be placed 
        cell = cells[move.row][move.col];
        // Use the saved cell scope to send a "move" event to the 
        // "cellWidget" directive 
        cell.scope.$emit("makeMoveEvent", chip);
        if (index < moves.length)
        {
            // Call this function again after a second, so every 
            // second it places a chip on the board 
            $timeout(function () {
                      sendMoveEvent (cells, $timeout, blackChips, whiteChips);
                     }, 1000, false);  
        }
        else 
        {
            // Wait until the last "move" event is processed before 
            // setting the demo in-progress flag back to false
            $timeout(function() {
                        demo.inProg = false; 
                     }, 0);
        }
    };
} 