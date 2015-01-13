describe('Controller: boardGame', function () {
    beforeEach(module('playGame'));
    var ctrl; 
    beforeEach(inject(function($rootScope, $controller) {
        var scope = $rootScope.$new(); 
        ctrl = $controller('boardGame', {$scope: scope});
    })); 
    
    it ('should have correct default values', function() {
        expect(ctrl.numberOfChips).toEqual(100); 
        expect(ctrl.numberOfRows).toEqual(25); 
        expect(ctrl.numberOfCols).toEqual(40); 
    });
});
