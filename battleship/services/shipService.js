function shipService () {
    var self = this;
    // Create an array to save ship info 
    self.createShips = function (shipArray) {
        var ships = []; 
        for (var i = 0; i < shipArray.length; i++) {
            ships[i] = new Ship(shipArray[i].name, shipArray[i].size); 
        }
        return ships; 
    };
            
    function Ship (name, size) {
        this.name = name; 
        this.size = size;
        this.life = size; 
        this.row = null;
        this.col = null;
        this.invalid = false; 
        this.addToBoard = false;
        this.destroyed = false; 
    }
    
    Ship.prototype.attacked = function () {
        this.life--; 
        if (this.life === 0) {
            this.destroyed = true; 
        }
    }; 
}