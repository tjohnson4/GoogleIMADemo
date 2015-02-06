(function(window) {

    // Constructor
    function Logger() {}

    Logger.PLATFORM = undefined;
    // Navigation Public Methods
    Logger.log = function(msg){
        console.log(msg);
        var xhr = new XMLHttpRequest();
        xhr.open("POST","log?msg="+Logger.PLATFORM+"::"+msg,true);
        xhr.send();
    };

    // Scope Helper
    window.Logger = Logger;
}(window))