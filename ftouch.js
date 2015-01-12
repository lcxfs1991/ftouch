/**
 * Created by heyli on 2015/1/9.
 */


var core = (function(){

    var core = {};
    try {
        var vendors = ['ms', 'moz', 'webkit', 'o'];

        core.on = function(object, event, callback) {
            object.addEventListener(event, function(ev) {
                (callback)(ev);
            }, false);
        };

        core.css = function(object, cssStyle, value) {
            var cssText = '';
            if (object) {
                for (key in vendors) {
                    cssText += '-' + vendors[key] + '-' + cssStyle + ';' + value + ';';
                }
                cssText += cssStyle + ';' + value + ';';
            }
            object.style.cssText = cssText;
        };
    }
    catch (e) {

    }

    return core;
}());

var ftouch = (function($win, $) {

    var self = this;

    var opt = {
        wrapper: document.getElementById('dom'),
        isVertical: true
    };

    var children = {
        node: opt.wrapper.children,
        length: opt.wrapper.children.length
    }

    var config = {
        currentNode: 0,
        direction: 0
    }

    var touchEndDistance = 0;
    var currentDelta = 0;

    var init = function() {
        setTimeout(function() {
            config.domWidth = opt.wrapper.clientWidth;
            config.domHeight = opt.wrapper.clientHeight;
            swipe();
        }, 200);
    };

    var swipe = function() {

        $.css(dom, 'transform', 'translate3d(0, 0, 0)');
        $.css(dom, 'transition', '0s');

        var startPos = null;
        var movePos = null;
        var swipeThreshold =  config.domHeight / 9;
        var bouncingThreshold = config.domHeight / 5;

        $.on(dom, 'touchstart', function(ev) {
            startPos = ev.touches[0];
        });

        $.on(dom, 'touchmove', function(ev) {
            movePos = ev.touches[0];
            var movePosDelta = (opt.isVertical) ? movePos.pageY : movePos.pageX;
            var startPosDelta = (opt.isVertical) ? startPos.pageY : startPos.pageX;
            var distance = movePosDelta - startPosDelta;
            checkDirection(distance);
            currentDelta += distance;
            var baseHeight = 0;
            if (config.direction === -1) {
                baseHeight = config.currentNode * config.domHeight + (-1) * config.direction * bouncingThreshold;
            }
            else if (config.direction === 1) {
                baseHeight = -1 * (config.currentNode * config.domHeight + bouncingThreshold);
            }


            if (config.currentNode === 0 && currentDelta >= baseHeight && config.direction === -1) {
                currentDelta = baseHeight;
            }
            else if (config.currentNode === children.length - 1 && currentDelta <=   baseHeight  && config.direction === 1) {
                currentDelta =  baseHeight;
            }

            touchEndDistance = currentDelta;
            dom.style.webkitTransform = (opt.isVertical) ? 'translate3d(0, ' + currentDelta + 'px, 0)' : 'translate3d(' + currentDelta + 'px, 0, 0)';
            startPos = movePos;
        });

        $.on(dom, 'touchend', function(ev) {
            var touchEndDistanceABS = Math.abs(touchEndDistance);
            var baseHeight = config.currentNode * config.domHeight + config.direction * swipeThreshold;

            if (config.direction === -1 && touchEndDistanceABS <= baseHeight && config.currentNode !== 0) {
                slide(-1);
             }
            else if (config.direction === 1 && touchEndDistanceABS >= baseHeight && config.currentNode !== children.length - 1) {
                slide(1);
            }
            else {
                slide(0);
            }
        });

    };

    var slide = function(num) {
        config.currentNode += num;
        currentDelta = -1 * config.currentNode * config.domHeight;
        dom.style.webkitTransform = 'translate3d(0, ' + currentDelta + 'px, 0)';
        touchEndDistance = 0;
    };

    var checkDirection = function(distance) {
        // isVertical = true, 1 -> to bottom, -1 -> to top
        config.direction = (distance > 0) ? -1 : 1;
        if (config.direction === -1) {
            return false;
        }
        return true;
    };

    var resetSwipe = function() {
        endDistance = 0;
        currentDelta = 0;
    };

    var ftouch = {
        opt: opt,
        init: init
    };

    return ftouch;
}(window, core));