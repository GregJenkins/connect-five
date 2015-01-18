describe('Service: boardGameValues', function () {
    beforeEach(module('connectFive'));
    var valueService; 
    beforeEach(inject(function($injector) {
        valueService = $injector.get('boardGameValues'); 
    })); 
    
    it ('should have correct default values', function() {
        expect(valueService.numberOfChips).toEqual(100); 
        expect(valueService.numberOfRows).toEqual(25); 
        expect(valueService.numberOfCols).toEqual(40); 
    });
});
