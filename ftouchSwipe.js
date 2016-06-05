/**
 * Created by heyli on 2016/6/6.
 */

;(function() {



    function FTouchSwipe(opt, params) {
        this.opt = opt || {},
        this.params = params || {};
        this.params.currentNode = 0;
    }

    FTouchSwipe.prototype.init = function() {
        this.initStyle();
        this.renderCss(this.opt.wrapper, {'transform':  'translate3d(0, 0, 0)', 'transition': '0'});
    };

    FTouchSwipe.prototype.initStyle = function() {
        var pa = this.params;
        var op = this.opt;
        pa.childrenNode = opt.wrapper.children;
        pa.childrenLength = opt.wrapper.children.length;
        pa.domWidth = op.wrapper.clientWidth;
        pa.domHeight = op.wrapper.clientHeight;
        pa.offsetDelta = (op.isVertical) ? pa.domHeight : pa.domWidth;
        this.swipeThreshold =  pa.offsetDelta / 9;
        this.bouncingThreshold = pa.offsetDelta / 5;
        var offsetStyle = (op.isVertical) ? 'top' : 'left';
        for (var i = 0; i < pa.childrenLength; i++) {
            pa.childrenNode[i].style.cssText = 'position:absolute;height: ' + pa.domHeight 
                                             + 'px;width: ' + pa.domWidth + 'px;'
                                             + offsetStyle + ': ' + (pa.offsetDelta * i) + 'px;';
        }
    };

    FTouchSwipe.prototype.ontouchmove = function(ev) {
        ev.preventDefault();
        var baseLength = 0;
        var pa = this.params;

        if (pa.direction === -1) {
            baseLength = pa.currentNode * pa.offsetDelta + (-1) * pa.direction * this.bouncingThreshold;
        }
        else if (pa.direction === 1) {
            baseLength = -1 * (pa.currentNode * pa.offsetDelta + this.bouncingThreshold);
        }

        if (pa.currentNode === 0 && pa.currentDelta >= baseLength && pa.direction === -1) {
            pa.currentDelta = baseLength;
            
        }
        else if (pa.currentNode === pa.childrenLength - 1 && pa.currentDelta <=  baseLength  && pa.direction === 1) {
            pa.currentDelta =  baseLength;
        }

        pa.touchEndDistance = pa.currentDelta;
        var transform = (this.opt.isVertical) ? 'translate3d(0, ' + pa.currentDelta + 'px, 0)' 
                                              : 'translate3d(' + pa.currentDelta + 'px, 0, 0)';
        this.renderCss(this.opt.wrapper, {'transform': transform});
    };

    FTouchSwipe.prototype.ontouchend = function(ev) {
        var pa = this.params;
        var touchEndDistanceABS = Math.abs(pa.touchEndDistance);
        var baseLength = pa.currentNode * pa.offsetDelta + pa.direction * this.swipeThreshold;

        if (pa.currentNode !== 0 && pa.direction === -1 && touchEndDistanceABS <= baseLength) {
            this.slide(-1);
         }
        else if (pa.currentNode !== pa.childrenLength - 1 && pa.direction === 1 && touchEndDistanceABS >= baseLength) {
            this.slide(1);
        }
        else {
            this.slide(0);
        }
    };

    FTouchSwipe.prototype.slide = function(num) {
        var pa = this.params;
        var option = this.opt;
        pa.currentNode += num;
        pa.currentDelta = -1 * pa.currentNode * pa.offsetDelta;
        var transform = (option.isVertical) ? 'translate3d(0, ' + pa.currentDelta + 'px, 0)' 
                        : 'translate3d(' + pa.currentDelta + 'px, 0, 0)';
        this.renderCss(option.wrapper,
        {
            'transform': transform,
            'transition': '0.3s'
        });
        pa.touchEndDistance = 0;
        if (num !== 0 && option.swipe.onswipechange) {
            option.swipe.onswipechange();
        }
    };

    window.FTouchSwipe = FTouchSwipe;


})();