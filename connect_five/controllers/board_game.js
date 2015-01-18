
angular.module('connectFive')
    .service('winService', [winService])
    .service('gameSetupService', [gameSetupService])
    .service('demoService', [demoService])
    .service('boardGameValues', [boardGameValues])
    .service('watchCountService', [watchCountService])
    .controller('boardGame', ['winService', 'gameSetupService', 
                              'demoService', '$scope', "$timeout",
                              'boardGameValues', '$rootScope',
                              'watchCountService',
                              function(winService, gameSetupService, 
                                       demoService, $scope, $timeout,
                                       boardGameValues, $rootScope,
                                       watchCountService) {
        var self = this;

        // Intitalize the board game service 
        boardGameValues.init(self);                                
    
        // Method to reload the board game. It's called from the 
        // confgure page 
        self.reloadBoardGame = function (isUpdated) 
        { 
            var created = false; 
            if (isUpdated && !self.demoObject.inProg)
            {
                self.newGame(true);
                created = true; 
            }
            $scope.$root.$broadcast('selectTabEvent', 0);
            return created; 
        };
                                  
        // Create a new game or reset back to its initial state 
        self.newGame = function(init) {
            // Don't create a new game while demo is running, 
            if (!init && self.demoObject.inProg)
            {
                return;
            }  
            if (init)
            {
                // Create all the JS objects for the game  
                var boardAndChips = 
                        gameSetupService.createBoardAndChips(boardGameValues);
                                                         
                self.cells = boardAndChips.cells; 
                self.blackChips = boardAndChips.blackChips; 
                self.whiteChips = boardAndChips.whiteChips;
                self.msgObject = boardAndChips.msgObject;
                self.demoObject = boardAndChips.demoObject;
                self.currentChip = boardAndChips.currentChip;
            }
            else 
            {
                // Reset the game back to its initial state
                gameSetupService.resetBoardAndChips(self.cells, self.blackChips, 
                                                    self.whiteChips); 
            }
        };
                          
        self.newGame(true);                           
    
        // Method to start demo. It's called from the demo link                             
        self.startDemo = function() {
            demoService.startDemo(self.cells, $timeout,
                                  self.blackChips, self.whiteChips,
                                  self.demoObject); 
        };
        
        // Method to find and return a chip object by parsing the 
        // passed-in chip id to get the chip's color and chip's index 
        self.getChip = function getChip(chipId)
        {
            var matchString = chipId.match(/(black|white)_(\d+)/gi);
            if (matchString != null)
            {
                if (RegExp.$1 == 'black')
                {
                    return self.blackChips[RegExp.$2];
                }
                else 
                if (RegExp.$1 == 'white')
                {
                    return self.whiteChips[RegExp.$2];
                }
            }
            return null; 
        };
        
        // Internal function to set the text in the top message box 
        // according to the state of the current chip object 
        function logMessage()
        {
            if (self.currentChip.chip.color == 'black')
            {
                
                self.msgObject.message = (self.currentChip.win ? "Black Wins!!!!" : "White's Turn");
            }
            else 
            {
                self.msgObject.message = (self.currentChip.win ? "White Wins!!!!" : "Black's Turn");
            }
            self.msgObject.scope.$digest();
        }
        
        // Method to save the current chip object. The current chip 
        // object is used to set the chip's CSS style and to determine 
        // the winner 
        self.setCurrentChip = function (chip, prevParent)
        {
            // If moving a chip from a cell to another cell,
            // currentChip remains the same, but unsets the
            // chip value of the previous cell 
            if (chip === self.currentChip.chip)
            {
                prevParent.chip = null;  
            }
            else 
            {
                if (self.currentChip.chip != null)
                {
                    self.currentChip.chip.draggable = 'false';
                }      
                var prevChip = self.currentChip.chip; 
                self.currentChip.chip = chip;

                // Call $digest() for only the previous chip so it 
                // doesn't update the UI for all the chips 
                if (prevChip != null)
                {
                    prevChip.scope.$digest();
                }
                else 
                {
                    // Hide the demo link if this is the first 
                    // chip dragged to the board 
                    self.demoObject.scope.$digest();
                }
            }
            // Check for a winner
            if (winService.checkWin(self.currentChip.chip, self.cells))
            {
                self.currentChip.win = true;             
                self.msgObject.animate = true;
            }
            // Call $digest() for only the current chip so 
            // it doesn't update the UI for all the chips 
            self.currentChip.chip.scope.$digest();
            logMessage();
        };
        // Log watch count when $apply() is called                         
        watchCountService.logWatchCount($rootScope);                           
            
    }]);
