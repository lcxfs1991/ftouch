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
        isVertical: false
    };



    var init = function() {
        swipe();
    };

    var swipe = function() {
        var currentY = 0;
        $.css(dom, 'transform', 'translate3d(0, 0, 0)');
        $.css(dom, 'transition', '0s');

        var startPos = null;
        var movePos = null;

        $.on(dom, 'touchstart', function(ev) {
            startPos = ev.touches[0];
            console.log(startPos);
        });

        $.on(dom, 'touchmove', function(ev) {
            movePos = ev.touches[0];
            var distance = movePos.pageY - startPos.pageY;
            currentY += distance;
            dom.style.webkitTransform = 'translate3d(0, ' + currentY + 'px, 0)';
            startPos = movePos;
            console.log(distance);
        });

    };

    var ftouch = {
        opt: opt,
        init: init
    };

    return ftouch;
}(window, core));