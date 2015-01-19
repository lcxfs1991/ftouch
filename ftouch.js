/**
 * Created by heyli on 2015/1/9.
 */

var ftouchUtils = (function(){

    var utils = {};
    try {
        var vendors = ['ms', 'moz', 'webkit', 'o'];

        utils.on = function(object, event, callback) {
            object.addEventListener(event, function(ev) {
                (callback)(ev);
            }, false);
        };

        utils.css = function(object, styleList) {
            var cssText = '';
            for (cssStyle in styleList) {
                if (object) {
                    for (key in vendors) {
                        cssText += '-' + vendors[key] + '-' + cssStyle + ':' + styleList[cssStyle] + ';';
                    }
                    cssText += cssStyle + ':' + styleList[cssStyle] + ':';
                }
            }
            object.style.cssText = cssText;
        };
    }
    catch (e) {

    }

    return utils;
}());

var ftouch = (function($win, $) {

    var opt = {
        wrapper: $win.document.body,
        isVertical: false
    };

    var config = {
        direction: 0,
        touchEndDistance: 0,
        currentDelta: 0
    };

    var init = function(option) {
        for (key in option) {
            opt[key] = option[key];
        }
    };

    var register = function(object) {
        var pluginArr = object.split(',');
        for (var i = 0; i < pluginArr.length; i++) {
            if (typeof $win[pluginArr[i]] === 'object') {
                var obj = $win[object];
                obj.opt = opt;
                obj.config = config;
                obj.$ = $;
                obj.getDirection = getDirection;
                eventHandler(obj);

                setTimeout(function() {
                    obj.init();
                }, 50); 
            } 
        }  
    };

    var getDirection = function(distance) {
        // isVertical = true, 1 -> to bottom, -1 -> to top
        if (distance > 0) {
            config.direction = -1;
        }
        else if (distance < 0) {
            config.direction = 1;
        }
        else {
            config.direction = 0;
        }

        if (config.direction === -1) {
            return false;
        }
        return true;
    };

    var eventHandler = function(obj) {

        var custVar = {
            startPos: null,
            movePos: null,
            startPosDelta: 0,
            movePosDelta: 0,
            distance: 0
        };
        $.on(opt.wrapper, 'touchstart', function(ev) {
            custVar.startPos = ev.touches[0];
            obj.ontouchstart && obj.ontouchstart(ev, custVar);
            opt.ontouchstart && opt.ontouchstart();
        });

        $.on(opt.wrapper, 'touchmove', function(ev) {
            custVar.movePos = ev.touches[0];
            custVar.movePosDelta = (opt.isVertical) ? custVar.movePos.pageY : custVar.movePos.pageX;
            custVar.startPosDelta = (opt.isVertical) ? custVar.startPos.pageY : custVar.startPos.pageX;
            custVar.distance = custVar.movePosDelta - custVar.startPosDelta;
            getDirection(custVar.distance);
            config.currentDelta += custVar.distance;
            
            obj.ontouchmove && obj.ontouchmove(ev, custVar);

            custVar.startPos = custVar.movePos;
        });

        $.on(opt.wrapper, 'touchend', function(ev) {
            obj.ontouchend && obj.ontouchend(ev, custVar);
            opt.ontouchend && opt.ontouchend();
        });
    };

    var ftouch = {
        opt: opt,
        init: init,
        register: register
    };

    return ftouch;
}(window, ftouchUtils));