// Following function is copied from https://github.com/vtortola/WebSocketListener
// with some modifications
function connectionService ($q, $timeout, $rootScope) {
    
    var self = this;
    self.ctrl = null; 
    self.useConnect = false;
    self.chipColor = null;
    self.connection = null; 
    self.reloadBoardGame = false; 
    self.guid = getGuid(); 
    self.init = function(ctrl) {
        this.ctrl = ctrl; 
    }
    self.connect = function (wsurl) {
        if (typeof wsurl === 'undefined') { 
            wsurl = 'ws://cfserver.herokuapp.com:80';
        }
        var sep = '+'; 
        if (wsurl.indexOf('?') < 0) {
             sep = '?';
        }
        wsurl = wsurl + sep + 'guid=' + self.guid;
        if (self.connection !== null) {
            self.connection.close(false); 
        }
        self.connection = connection(wsurl);
        displayMessage('Connecting to a player...');
        return self.connection; 
    };
    
    self.getConnection = function() { 
        return self.connection; 
    }; 
    
    self.resetBoardAndChips = function () {
        self.ctrl.resetBoardAndChips();
        self.ctrl.whoseTurn(); 
        $rootScope.$apply();
    };
    
    self.forbidThisChip = function(color) {
        if (!self.useConnect) {
            return false; 
        } 
        if (self.ctrl.currentChip.chip === null) {
            return (self.chipColor !== 'black' || 
                    color !== 'black');
        }
        return (color !== self.chipColor); 
    };
    
    self.setColor = function(color) { 
        self.chipColor = color;
        self.ctrl.whoseTurn(); 
    };  
    
    self.moveChip = function(obj) { 
        self.ctrl.moveChip(obj); 
    };
    
    function getGuid () { 
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                       .toString(16)
                       .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    }
    
    function displayMessage (str) { 
        var msgObj = self.ctrl.msgObject; 
        msgObj.message = str;
        if(!$rootScope.$$phase) {
            msgObj.scope.$digest();
        }
    }
    
    function connection(websocketUrl) {
        self.useConnect = true; 
        var me = {};
        var listeners = [];
        var oneListeners = [];

        me.isConnected = false;

        oneListeners.removeOne = function (listener) {
            var index = oneListeners.indexOf(listener);
            if(index!=-1)
                oneListeners.splice(index, 1);
        };

        var correlationId = 1;
        me.nextCorrelationId = function () {
            return correlationId++;
        };

        $rootScope.queuedMessages = [];

        me.listen = function (predicate, handler) {
            listeners.push({ p: predicate, h: handler });
        };

        me.listenOnce = function (predicate, timeout) {
            var deferred = $q.defer();
            deferred.done = false;
            var listener = { d: deferred, p: predicate };
            oneListeners.push(listener);
            if (timeout) {
                $timeout(function () {
                    if (!deferred.done)
                        deferred.reject('timeout');
                    oneListeners.removeOne(listener);
                }, timeout);
            }
            var promise = deferred.promise;
            promise.then(function (data) {
                deferred.done = true;
            });
            return promise;
        };

        var onopen = function () {
            $rootScope.websocketAvailable = true;
            me.isConnected = true;
            $rootScope.$$phase || $rootScope.$apply();
            if ($rootScope.queuedMessages) {
                for (var i = 0; i < $rootScope.queuedMessages.length; i++) {
                    ws.send(JSON.stringify($rootScope.queuedMessages[i]));
                }
                $rootScope.queuedMessages = null;
                $rootScope.$$phase || $rootScope.$apply();
            }
        };

        var onclose = function () {
            me.isConnected = false;
            $rootScope.websocketAvailable = false;
            $rootScope.$$phase || $rootScope.$apply();
            $rootScope.queuedMessages = $rootScope.queuedMessages || [];
            if (self.reloadBoardGame) { 
                displayMessage('Connection lost. Reload board game...');
                $timeout( function () { 
                    self.ctrl.reloadBoardGame(true);
                }, 1000); 
            }
            self.reloadBoardGame = false; 
//            setTimeout(function () {
//                ws = connect();
//            }, 5000);
        };

        var onmessage = function (msg) {
            var obj = JSON.parse(msg.data);
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                if (listener.p(obj))
                    listener.h(obj);
            }
            var remove = [];
            for (var i = 0; i < oneListeners.length; i++) {
                var listener = oneListeners[i];
                if (listener.p(obj)) {
                    var o = obj;
                    listener.d.resolve(o);
                    remove.push(listener);
                }
            }
            for (var i = 0; i < remove.length; i++) {
                oneListeners.removeOne(remove[i]);
            }
        };

        var onerror = function () {
            console.log('onerror');
        };

        me.send = function (obj) {          
            if ($rootScope.queuedMessages)
                $rootScope.queuedMessages.push(obj);
            else
                ws.send(JSON.stringify(obj));
        }
        
        me.close = function(reload) { 
            ws.close(); 
            self.useConnect = false; 
            self.reloadBoardGame = reload; 
        }; 

        var setHandlers = function (w) {
            w.onopen = onopen;
            w.onclose = onclose;
            w.onmessage = onmessage;
            w.onerror = onerror;
        };

        var connect = function () {
            console.log('connecting...');
            var w = new WebSocket(websocketUrl);
            setHandlers(w);
            return w;
        }

        var ws = connect();

        return me;
    };
};