describe('Service: boardGameValues', function () {
    beforeEach(module('connectFive'));
    var valueService, ctrl;
    
    beforeEach(inject(function($rootScope, $controller, $injector) {
        valueService = $injector.get('boardGameValues');
        var scope = $rootScope.$new();
        ctrl = $controller('boardGame', {$scope: scope}); 
    })); 
    
    it ('should have correct default values', function() {
        expect(valueService.numberOfChips).toEqual(100); 
        expect(valueService.numberOfRows).toEqual(25); 
        expect(valueService.numberOfCols).toEqual(40); 
    });
    
    it ('should correctly handle the call to reload board game', 
        function() {
            spyOn(ctrl, 'reloadBoardGame');
            valueService.reloadBoardGame(true);
            valueService.reloadBoardGame(false); 
            expect(ctrl.reloadBoardGame.calls.argsFor(0).shift()).toBeTruthy(); 
            expect(ctrl.reloadBoardGame.calls.argsFor(1).shift()).toBeFalsy();
            // Setting ctrl to null, it returns false cand 
            // it doesn't call ctrl.reloadBoardGame()
            ctrl.reloadBoardGame.calls.reset();
            valueService.init(null);
            expect(valueService.reloadBoardGame(true)).toBeFalsy();  
            expect(ctrl.reloadBoardGame).not.toHaveBeenCalled();       
        });
    it ('should correctly determine whether it is demo-able', 
       function () { 
           var defaultRows = valueService.numberOfRows;
           var defaultCols = valueService.numberOfCols;
           
           // By default it's demo-able 
           expect(valueService.isDemoAble()).toBeTruthy();
           valueService.numberOfRows = defaultRows - 1; 
           expect(valueService.isDemoAble()).toBeFalsy(); 
           valueService.numberOfRows = defaultRows;
           valueService.numberOfCols = defaultCols - 1;
           expect(valueService.isDemoAble()).toBeFalsy();
           valueService.numberOfCols = defaultCols;
           // It's demo-able if it has more than or equal to 
           // 20 chips 
           valueService.numberOfChips = 20;
           expect(valueService.isDemoAble()).toBeTruthy();
           valueService.numberOfChips = 19;
           expect(valueService.isDemoAble()).toBeFalsy();
           
       });            
     it ('sohuld be able to tell whether values are default values', 
         function () { 
           var defaultRows = valueService.numberOfRows;
           var defaultCols = valueService.numberOfCols;
           var defaultChips = valueService.numberOfChips;
           
           // It starts with default values   
           expect(valueService.isDefault()).toBeTruthy();
           valueService.numberOfRows = defaultRows - 1; 
           expect(valueService.isDefault()).toBeFalsy(); 
           valueService.numberOfRows = defaultRows;
           valueService.numberOfCols = defaultCols - 1;
           expect(valueService.isDefault()).toBeFalsy();
           valueService.numberOfCols = defaultCols; 
           valueService.numberOfChips = defaultChips - 1;
           expect(valueService.isDefault()).toBeFalsy();
           valueService.numberOfChips = defaultChips;
           // It ends with default values 
           expect(valueService.isDefault()).toBeTruthy();
         });
});
