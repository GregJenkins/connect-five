// Share this service between two controllers, "boardGame" and 
// "confugre", so a user can confugre the board game values from 
// the "configure" page and the "boardGame" controller can use 
// these board game values to create board game objects. 
function boardGameValues () 
{
    var defaultChips = 100, 
        defaultRows = 25, 
        defaultCols = 40; 
    
    var self = this; 
    self.boardGameCtrl = null;
    // Save the "boardGame" controller, so it can call
    // board game methods from the "confugre" controller
    self.init = function(ctrl) {
        self.boardGameCtrl = ctrl;
    };
    // Reset the board game values to default values 
    self.setToDefault = function() {
        self.numberOfChips = defaultChips;
        self.numberOfRows = defaultRows; 
        self.numberOfCols = defaultCols; 
    };
    self.setToDefault();
     
    // Reload the board game if the board game values 
    // have been changed 
    self.reloadBoardGame = function (isUpdated) {
        if (self.boardGameCtrl != null)
        {
            return self.boardGameCtrl.reloadBoardGame(isUpdated);
        }
        return false; 
    };
    
    // Conditions for doing demo 
    self.isDemoAble = function() { 
        return ((self.numberOfRows == defaultRows) && 
                (self.numberOfCols == defaultCols) &&
                (self.numberOfChips >= 20));
    };
    
    // Return true if the board game values are default 
    // values
    self.isDefault = function() {
        return ((self.numberOfRows == defaultRows) && 
                (self.numberOfCols == defaultCols) &&
                (self.numberOfChips == defaultChips));
    };
}
    

    