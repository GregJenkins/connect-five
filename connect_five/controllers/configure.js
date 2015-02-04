angular.module('connectFive')
.controller('configure', ['$scope', 'boardGameValues',
                          function ($scope, boardGameValues){
    
    var self = this; 
    self.boardGame = boardGameValues;
    $scope.mobile = self.boardGame.displayForMobile; 
    // Reload the board game if any board game value has 
    // been changed 
    self.reloadBoardGame = function() {
        // Don't reload the board game if any board game value 
        // is invalid
        if (!$scope.configureForm.$valid)
        {
            return;
        }
        if (self.boardGame.reloadBoardGame($scope.configureForm.$dirty))
        {
            // Clear the dirty flag if the board game is reloaded 
            // successfully 
            $scope.configureForm.$setPristine();
        }
    };
    // Reset to the default values and reload the board game   
    self.setToDefault = function() {
        $scope.mobile = false; 
        self.boardGame.setToDefault();
        // If it can't reload the board game due to the demo being 
        // in-progress make all input fields dirty to remind the user 
        // to click on the reload button later 
        if (!self.boardGame.reloadBoardGame(true))
        {
            $scope.configureForm.numberofchips.$setDirty();
            $scope.configureForm.numberofrows.$setDirty();
            $scope.configureForm.numberofcols.$setDirty();
        }
        else 
        {
            $scope.configureForm.$setPristine();
        }
    };
    
    // Return true if the board game values are default values.
    // This method is used to hide and show the "Default" button 
    self.isDefault = function() {
        return self.boardGame.isDefault();
    };
    // Set display for mobile 
    self.setMobile = function (mobile) { 
        self.boardGame.setMobile(mobile); 
    }; 
                              
}]); 