"use strict";

function EventBus (onDispose) {

    var ALL_EVENTS = "*";

    var onDisposeHandler = onDispose;
    var handlersMap = {};
    var children = [];

    var disposeChild = function(child)  {
        children = children.filter(function(object)  {return object.bus != child;});
    };

    function runThroughHandlers(selector, eventType, payload, thisArg) {
        var handlers = handlersMap[selector] || [];
        var expired = [];
        handlers.forEach(function(handler)  {
            var status = handler(eventType, payload, thisArg);
            if (status !== false && handler.expires) {
                handler.counter--;
                if (handler.counter == 0) expired.push(handler)
            }
        });
        handlersMap[selector] = expired.length == 0
            ? handlers
            : handlers.filter(function(handler)  {return expired.indexOf(handler) == -1;});
    }

    this.subscribe = function(eventType, eventHandler, expirationCounter)  {
        var handlers = handlersMap[eventType] || [];
        eventHandler.expires = expirationCounter != undefined;
        eventHandler.counter = expirationCounter;
        handlers.push(eventHandler);
        handlersMap[eventType] = handlers;
    };

    this.put = function(argA, argB)  {
        var event, type, payload;
        if(argA instanceof Object) {
            event = argA;
            type = event.type;
            payload = event.payload;
        } else {
            event = {type: argA, payload: argB};
            type = argA;
            payload = argB;
        }
        runThroughHandlers(type, type, payload, this);
        runThroughHandlers("*", type, payload, this);
        children.forEach(function(object)  {
            var types = object.types;
            if (types.indexOf(ALL_EVENTS) >= 0 || types.indexOf(type) >= 0) object.bus.put(event);
        });
    }.bind(this);

    this.branch = function (types) {
        var child = new EventBus(disposeChild);
        children.push({
            types: types || [ALL_EVENTS],
            bus: child
        });
        return child;
    };

    this.merge = function (bus) {
        var clone = this.branch();
        bus.subscribe(ALL_EVENTS, function (type, payload) {
            clone.put(type, payload);
        });
        return clone;
    };

    this.close = function()  {
        handlersMap = {};
        children = [];
        onDisposeHandler.call(this, this);
    }.bind(this);

}

if(typeof module != "undefined")
    module.exports = EventBus;