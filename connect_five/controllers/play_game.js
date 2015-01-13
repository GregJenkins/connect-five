
angular.module('playGame', ['ngAnimate'])
    .service('winService', [winService])
    .service('gameSetupService', [gameSetupService])
    .service('demoService', [demoService])
    .controller('boardGame', ['winService', 'gameSetupService', 
                              'demoService', '$scope', "$timeout", 
                              function(winService, gameSetupService, 
                                       demoService, $scope, $timeout) {
        var self = this;

        self.numberOfChips = 100;      
        self.numberOfRows = 25;
        self.numberOfCols = 40;                         
        
        self.newGame = function(init) {
            if (!init && self.demoObject.inProg)
            {
                return;
            }
            if (init)
            {
                var boardAndChips = 
                        gameSetupService.createBoardAndChips(self.numberOfChips, 
                                                         self.numberOfRows, 
                                                         self.numberOfCols); 
                                                         
                self.cells = boardAndChips.cells; 
                self.blackChips = boardAndChips.blackChips; 
                self.whiteChips = boardAndChips.whiteChips;
                self.msgObject = boardAndChips.msgObject;
                self.demoObject = boardAndChips.demoObject;
                self.currentChip = boardAndChips.currentChip;
            }
            else 
            {
                gameSetupService.resetBoardAndChips(self.cells, self.blackChips, 
                                                    self.whiteChips); 
            }
        };
        self.newGame(true);                           
    
        self.startDemo = function() {
            demoService.startDemo(self.cells, $timeout,
                                  self.blackChips, self.whiteChips,
                                  self.demoObject); 
        };
                        
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
        
        self.setCurrentChip = function (chip, prevParent)
        {
            // if moving chip from a cell to the other
            // currentChip remains the same, but unset 
            // chip of previous cell 
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

                // Call $digest() for only previous chip and 
                // the current chip, so it doesn't update 
                // bindings for all chips 
                if (prevChip != null)
                {
                    prevChip.scope.$digest();
                }
                else 
                {
                    // Update(hide) demo element if this is the first chip 
                    // dragged to the board 
                    self.demoObject.scope.$digest();
                }
            }
            if (winService.checkWin(self.currentChip.chip, self.cells))
            {
                self.currentChip.win = true;             
                self.msgObject.animate = true;
            }
            self.currentChip.chip.scope.$digest();
            logMessage();
        };
    }]);