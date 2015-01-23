describe('Controller: boardGame', function () {
    beforeEach(module('connectFive'));
    var ctrl, valueService, demoService, 
        gameSetupService, winService,
        rootScope; 
    
    
    beforeEach(inject(function($rootScope, $controller, $injector) {
        var scope = $rootScope.$new();
        rootScope = $rootScope; 
        ctrl = $controller('boardGame', {$scope: scope}); 
        valueService = $injector.get('boardGameValues');
        demoService = $injector.get('demoService');
        gameSetupService = $injector.get('gameSetupService');
        winService = $injector.get('winService');
    })); 
    
    it ('should have correct default data for all objects', 
        function () {
            expect(ctrl.cells.length).toEqual(25); 
            expect(ctrl.cells[0].length).toEqual(40); 
            expect(ctrl.blackChips.length).toEqual(100); 
            expect(ctrl.whiteChips.length).toEqual(100); 
            expect(ctrl.msgObject.message).toEqual('Play Game!!!!');
            expect(ctrl.msgObject.animate).toBeFalsy();
            expect(ctrl.msgObject.scope).toBeNull(); 
            expect(ctrl.demoObject.inProg).toBeFalsy();
            expect(ctrl.demoObject.scope).toBeNull();
            expect(ctrl.currentChip.chip).toBeNull();
            expect(ctrl.currentChip.win).toBeFalsy();
        });
    it ('should correctly handle call to reloadBoardGame()', 
        function () { 
            spyOn(rootScope, '$broadcast'); 
            spyOn(ctrl, 'newGame'); 
            // Test with diffent passed-in values 
            expect(ctrl.reloadBoardGame(true)).toBeTruthy();
            expect(ctrl.newGame).toHaveBeenCalled();
            expect(rootScope.$broadcast).toHaveBeenCalled();
            ctrl.newGame.calls.reset();
            rootScope.$broadcast.calls.reset();
            expect(ctrl.reloadBoardGame(false)).toBeFalsy();
            expect(ctrl.newGame).not.toHaveBeenCalled();
            expect(rootScope.$broadcast).toHaveBeenCalled();
            // Don't call ctrl.newGame if demo is in progress 
            ctrl.demoObject.inProg = true; 
            expect(ctrl.reloadBoardGame(true)).toBeFalsy();
            expect(ctrl.newGame).not.toHaveBeenCalled();
            expect(rootScope.$broadcast).toHaveBeenCalled()            
        });
    it ('should correctly handle call to newGame()', 
        function () {
            // Spy and mock up the returning value
            spyOn(gameSetupService, 'createBoardAndChips').and
                .returnValue({cells: ctrl.cells, 
                              blackChips: ctrl.blackChips, 
                              whiteChips: ctrl.whiteChips, 
                              msgObject: ctrl.msgObject,
                              demoObject: ctrl.demoObject, 
                              currentChip: ctrl.currentChip});
            spyOn(gameSetupService, 'resetBoardAndChips');
            // If demo in progress, don't call either mehod of 
            // gameSetupService
            ctrl.demoObject.inProg = true;
            ctrl.newGame(false); 
            expect(gameSetupService.createBoardAndChips).not.toHaveBeenCalled();
            expect(gameSetupService.resetBoardAndChips).not.toHaveBeenCalled();
            // Initial call 
            ctrl.demoObject.inProg = false; 
            ctrl.newGame(true); 
            expect(gameSetupService.createBoardAndChips).toHaveBeenCalled();
            expect(gameSetupService.resetBoardAndChips).not.toHaveBeenCalled();
            gameSetupService.createBoardAndChips.calls.reset();
            // Reset call 
            ctrl.newGame(false); 
            expect(gameSetupService.createBoardAndChips).not.toHaveBeenCalled();
            expect(gameSetupService.resetBoardAndChips).toHaveBeenCalled();
        });
    
    it ('should correctly call the startDemo() function', function () { 
        spyOn(demoService, 'startDemo'); 
        ctrl.startDemo(); 
        expect(demoService.startDemo).toHaveBeenCalled(); 
        });
    it ('should return a correct chip object when getChip() is called with a chip id', 
        function () {
            var chipId = 'black_0';
            var chipObject = ctrl.getChip(chipId); 
            expect(chipObject.id).toEqual(chipId);
            expect(chipObject.color).toEqual('black'); 
            chipId = 'white_99'; 
            chipObject = ctrl.getChip(chipId);
            expect(chipObject.id).toEqual(chipId);
            expect(chipObject.color).toEqual('white');
            chipId = 'test_30';
            chipObject = ctrl.getChip(chipId);
            expect(chipObject).toBeNull();        
        });
    
    
    it ('should correctly set the current chip, log messages, and call $digest()', 
        function() { 
            var argChip = ctrl.whiteChips[0]; 
            argChip.scope = rootScope.$new(); 
            spyOn(argChip.scope, '$digest'); 
            ctrl.msgObject.scope = rootScope.$new();
            spyOn(ctrl.msgObject.scope, '$digest'); 
            ctrl.demoObject.scope = rootScope.$new();
            spyOn(ctrl.demoObject.scope, '$digest');      
            spyOn(winService, 'checkWin').and.returnValue(false);
            
            // if passed-in chip is the same as the current chip - 
            // the chip was moved from one cell to the other cell, 
            // prevParent.chip is set to null           
            ctrl.currentChip.chip = argChip; 
            var prevParent = ctrl.cells[0];
            prevParent.chip = ctrl.currentChip.chip; 
            ctrl.setCurrentChip(argChip, prevParent);
            expect(prevParent.chip).toBeNull();
            expect(ctrl.currentChip.chip.scope.$digest).toHaveBeenCalled();
            expect(ctrl.msgObject.scope.$digest).toHaveBeenCalled();
            expect(ctrl.msgObject.message).toEqual("Black's Turn");
            expect(ctrl.demoObject.scope.$digest).not.toHaveBeenCalled(); 
            expect(winService.checkWin).toHaveBeenCalled(); 
            ctrl.currentChip.chip.scope.$digest.calls.reset();
            ctrl.msgObject.scope.$digest.calls.reset();
            winService.checkWin.calls.reset();
            // If passed-in chip is different from the current chip 
            ctrl.currentChip.chip = ctrl.blackChips[0];
            ctrl.currentChip.chip.scope = rootScope.$new(); 
            spyOn(ctrl.blackChips[0].scope, '$digest');
            ctrl.blackChips[0].draggable = 'true';
            // Set chip color to black, so it can display the 
            // message "White's Turn" 
            argChip.color = 'black';
            ctrl.setCurrentChip(argChip, prevParent); 
            expect(ctrl.blackChips[0].draggable).toEqual('false'); 
            expect(ctrl.blackChips[0].scope.$digest).toHaveBeenCalled(); 
            expect(ctrl.currentChip.chip).toBe(argChip); 
            expect(argChip.scope.$digest).toHaveBeenCalled();
            expect(ctrl.demoObject.scope.$digest).not.toHaveBeenCalled(); 
            expect(winService.checkWin).toHaveBeenCalled(); 
            expect(ctrl.msgObject.scope.$digest).toHaveBeenCalled();
            expect(ctrl.msgObject.message).toEqual("White's Turn");
            argChip.scope.$digest.calls.reset();
            winService.checkWin.calls.reset();
            ctrl.msgObject.scope.$digest.calls.reset();
            // If passed-in chip is the first chip to place on the 
            // board and it's a winning chip 
            ctrl.currentChip.chip = null;
            winService.checkWin.and.returnValue(true); 
            ctrl.setCurrentChip(argChip, prevParent); 
            expect(ctrl.currentChip.chip).toBe(argChip); 
            expect(ctrl.demoObject.scope.$digest).toHaveBeenCalled();
            expect(winService.checkWin).toHaveBeenCalled(); 
            expect(ctrl.currentChip.win).toBeTruthy(); 
            expect(ctrl.msgObject.animate).toBeTruthy();
            expect(argChip.scope.$digest).toHaveBeenCalled();
            expect(ctrl.msgObject.scope.$digest).toHaveBeenCalled();
            expect(ctrl.msgObject.message).toEqual('Black Wins!!!!');
        });         
});