function addEventHandler(obj,event_name,func_name){
    if (obj.attachEvent){
        obj.attachEvent("on"+event_name, func_name);
    }else if(obj.addEventListener){
        obj.addEventListener(event_name,func_name,true);
    }else{
        obj["on"+event_name] = func_name;
    }
}

function stopEvent(evt_in) {
    var evt = evt_in || window.event;
    if (evt.stopPropagation) {
        evt.stopPropagation();
        evt.preventDefault();
    } else if (typeof evt.cancelBubble != "undefined") {
        evt.cancelBubble = true;
        evt.returnValue = false;
    }
    return false;
}

String.prototype.addslashes = function () {
    return this.replace(/(["\\\.\|\[\]\^\*\+\?\$\(\)])/g, '\\$1');
};


function curTop(obj) {
    var toreturn = 0;
    while (obj) {
        toreturn += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return toreturn;
}

function curLeft(obj) {
    var toreturn = 0;
    while (obj) {
        toreturn += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    return toreturn;
}
