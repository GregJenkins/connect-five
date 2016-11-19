angular.module('connectFive')
.controller('connect', ['connectionService', '$scope', 
                        function(connectionService, $scope) {
    var self = this; 
    self.connectToServer = function() { 
        console.log('Connect to server ....'); 
        self.connection = connectionService.connect(); 
        self.connection.send({op: 'findPlayer', color: 'black'});
        $scope.$root.$broadcast('selectTabEvent', 0);
        
        self.connection.listen(function (obj) { 
            if (typeof obj.error !== 'undefined') { 
                console.log('Received: ' + JSON.stringify(obj));
                if (obj.error > 1) { 
                    self.connection.close(true); 
                }
                return false;   
            }
            if (typeof obj.op !== 'undefined') {
                return true; 
            }
            return false;
        }, function (obj) { 
            switch (obj.op) {
                case 'findPlayer':        
                break;
                case 'start': 
                    connectionService.setColor(obj.color);
                    $scope.$apply(); 
                break;
                case 'move': 
                    connectionService.moveChip(obj); 
                break;
                case 'newGame': 
                    connectionService.resetBoardAndChips(); 
                break;
                deafult: 
                    console.log('Invalid operation');
            }
             
        });  
    };  
}]); 