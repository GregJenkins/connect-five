describe('Service: gameSetupService', function () {
    beforeEach(module('connectFive'));
    var gameSetupService, rootScope;
    
    beforeEach(inject(function($rootScope, $injector) {
        rootScope = $rootScope; 
        gameSetupService = $injector.get('gameSetupService');
    })); 
    
    it ('should correctly create new board and chip objects', 
        function () { 
            // Test minimum values
            var testObject = new verifyGameObjects(5, 5, 10); 
            var returnObject = 
                    gameSetupService.createBoardAndChips(
                        testObject.getBGValues()); 
            expect(testObject.verify(returnObject)).toBeTruthy(); 
            // Test maximum values 
            testObject = new verifyGameObjects(25, 40, 500);
            returnObject = 
                gameSetupService.createBoardAndChips(
                        testObject.getBGValues()); 
            expect(testObject.verify(returnObject)).toBeTruthy(); 
            // Test any values 
            testObject = new verifyGameObjects(16, 21, 131);
            returnObject = 
                gameSetupService.createBoardAndChips(
                        testObject.getBGValues()); 
            expect(testObject.verify(returnObject)).toBeTruthy(); 
        });
    
    it ('should correctly reset the existing board and chip objects',
        function () { 
            var testObject = new verifyGameObjects(5, 6, 15); 
            var returnObject = 
                    gameSetupService.createBoardAndChips(
                        testObject.getBGValues());
            // Fill entrie board with chips
            var cells = returnObject.cells, cell;
            var color = 'black', chip, index = 0;
            var blacks = returnObject.blackChips; 
            var whites = returnObject.whiteChips; 
            for (var i = 0; i < cells.length; i++) {
                for (var j = 0; j < cells[0].length; j++) {
                    cell = cells[i][j];
                    if  (color == 'black') { 
                        chip = blacks[index];
                        color = 'white'; 
                    }
                    else 
                    {
                        chip = whites[index];
                        index++; 
                        color = 'black';  
                    }
                    chip.draggable = 'false'; 
                    chip.parent = cell; 
                    cell.winClass = true; 
                    cell.chip = chip; 
                    chip.scope = rootScope.$new();
                    spyOn(chip.scope, '$emit'); 
                }
            }
            gameSetupService.resetBoardAndChips(cells, blacks, whites); 
            // Verify results
            var callArgs; 
            for (var i = 0; i < cells.length; i++) {
                for (var j = 0; j < cells[0].length; j++) {
                    cell = cells[i][j];
                    expect(cell.chip).toBeNull();
                    expect(cell.winClass).toBeFalsy(); 
                }
            }
            for (var i = 0; i < blacks.length; i++) { 
                chip = blacks[i];
                expect(chip.draggable).toEqual('true'); 
                expect(chip.parent).toBeNull(); 
                expect(chip.scope.$emit).toHaveBeenCalledWith('resetChipState', chip.color);  
            }
            for (var i = 0; i < whites.length; i++) { 
                chip = whites[i];
                expect(chip.draggable).toEqual('true'); 
                expect(chip.parent).toBeNull(); 
                expect(chip.scope.$emit).toHaveBeenCalledWith('resetChipState', chip.color); 
            }
        });  
    
    it ('should get correct random chip position in pot', 
        function () {
            // Create game objects 
            var testObject = new verifyGameObjects(5, 5, 10); 
            var returnObject = 
                    gameSetupService.createBoardAndChips(
                        testObject.getBGValues());
            // Get a chip to test
            var chip = returnObject.blackChips[0]; 
            var pos; 
            // Randomly generate position for 100 times 
            for (var i = 0; i < 100; i++) { 
                pos = chip.getChipPotPos(); 
                expect((pos.left >= 1) && (pos.left <= 80)).toBeTruthy();
                expect((pos.top >= 1) && (pos.top <= 80)).toBeTruthy();
                if ((pos.left < 20) || (pos.left > 60)) {
                    expect((pos.top >= 20) || (pos.top <= 60)).toBeTruthy(); 
                }
            }
        }); 
    
    // Helper functions
    function verifyGameObjects (rows, cols, chips) {
        this.rows = rows; 
        this.cols = cols; 
        this.chips = chips; 
        this.getBGValues = function() {
            return {numberOfChips: this.chips, 
                    numberOfRows: this.rows,
                    numberOfCols: this.cols};
        };
        this.verify = function(gameObjects) {
            return (gameObjects.blackChips.length === this.chips &&
                    gameObjects.whiteChips.length === this.chips && 
                    gameObjects.cells.length === this.rows && 
                    gameObjects.cells[0].length === this.cols); 
        };
    }
});
    