/**
 * Created by heyli on 2015/1/9.
 */

;(function() {

    // bind event function
    var bindEvent = function(object, event, callback) {
        object.addEventListener(event, function(ev) {
            (callback)(ev);
        }, false);
    };

    // change css
    var renderCss = function(object, styleList) {
        // browser type
        var vendors = ['ms', 'moz', 'webkit', 'o'],
            cssText = '';

        for (cssStyle in styleList) {
            if (object) {
                for (var key in vendors) {
                    cssText += '-' + vendors[key] + '-' + cssStyle + ':' + styleList[cssStyle] + ';';
                }
                cssText += cssStyle + ':' + styleList[cssStyle] + ':';
            }
        }
        object.style.cssText = cssText;
    };

    // check data type
    var dataType = ["String", "Function", "Array", "Object"],
        is = {};
    for (var i = 0, len = dataType.length; i < len; i++) {
        (function(k) {
                is[dataType[k]] = function(object) {
                    return Object.prototype.toString.call(object) === '[object ' + dataType[k] + ']';
                }
            }
        )(i);
    }

    // default options
    var opt = {
        wrapper: window.document.body,  // event binding obj
        isVertical: false,            
    };

    // internal-sharing touch parameters
    var params = {
        direction: 0,
        touchEndDistance: 0,  // touchend moving distance
        currentDelta: 0,
        startPos: null,   // finger starting position
        movePos: null,    // finger moving position
        startPosDelta: 0,   //
        movePosDelta: 0,    //
        distance: 0         // distance
    };

    function FTouch(option, plugins) {
        var option = option || {}, // user-defined options
            plugins = plugins || []; // plugins

        for (var key in option) {
            opt[key] = option[key];
        }

        this.register(plugins);
    };


    FTouch.prototype.register = function(plugins) {

        if (is.String(plugins)) {
            plugins = plugins.split(',');
        }

        // register plugins
        for (var i = 0, len = plugins.length; i < len; i++) {
            if (is.Function(window[plugins[i]])) {
                var plugin = window[plugins[i]];
                plugin.prototype.bindEvent = bindEvent,
                plugin.prototype.renderCss = renderCss;
                var instance = new plugin(opt, params);
                instance.init();
                this.handleEvents(instance);
            }
        }  


    };

    // get moveing direction
    FTouch.prototype.getDirection = function(distance) {
        // isVertical = true, 1 -> to bottom, -1 -> to top
        if (distance > 0) {
            params.direction = -1;
        }
        else if (distance < 0) {
            params.direction = 1;
        }
        else {
            params.direction = 0;
        }

        if (params.direction === -1) {
            return false;
        }
        return true;
    };

    FTouch.prototype.handleEvents = function(obj) {

        var _this = this;

        bindEvent(opt.wrapper, 'touchstart', function(ev) {
            params.startPos = ev.touches[0];
            obj.ontouchstart && obj.ontouchstart(ev, params);
            opt.ontouchstart && opt.ontouchstart();
        });

        bindEvent(opt.wrapper, 'touchmove', function(ev) {
            params.movePos = ev.touches[0];
            params.movePosDelta = (opt.isVertical) ? params.movePos.pageY : params.movePos.pageX;
            params.startPosDelta = (opt.isVertical) ? params.startPos.pageY : params.startPos.pageX;
            params.distance = params.movePosDelta - params.startPosDelta;
            _this.getDirection(params.distance);

            params.currentDelta += params.distance;
            
            obj.ontouchmove && obj.ontouchmove(ev, params);

            params.startPos = params.movePos;
        });

        bindEvent(opt.wrapper, 'touchend', function(ev) {
            obj.ontouchend && obj.ontouchend(ev, params);
            opt.ontouchend && opt.ontouchend();
        });
    };

    window.FTouch = FTouch;

})();