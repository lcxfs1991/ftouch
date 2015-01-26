var swipe = {
    init: function() {
        var self = this;
        $ = this.$;
        this.config.currentNode = 0;
        setTimeout(function() {
            self.initStyle();
            $.css(this.opt.wrapper, {'transform':  'translate3d(0, 0, 0)', 'transition': '0'});
        }, 50); 
    },
    initStyle: function() {
        var cf = this.config;
        var op = this.opt;
        cf.childrenNode = opt.wrapper.children;
        cf.childrenLength = opt.wrapper.children.length;
        cf.domWidth = op.wrapper.clientWidth;
        cf.domHeight = op.wrapper.clientHeight;
        cf.offsetDelta = (op.isVertical) ? cf.domHeight : cf.domWidth;
        this.swipeThreshold =  cf.offsetDelta / 9;
        this.bouncingThreshold = cf.offsetDelta / 5;
        var offsetStyle = (op.isVertical) ? 'top' : 'left';
        for (var i = 0; i < cf.childrenLength; i++) {
            cf.childrenNode[i].style.cssText = 'position:absolute;height: ' + cf.domHeight 
                                             + 'px;width: ' + cf.domWidth + 'px;'
                                             + offsetStyle + ': ' + (cf.offsetDelta * i) + 'px;';
        }
    },
    ontouchmove: function(ev, custVar) {
        ev.preventDefault();
        var baseLength = 0;
        var cf = this.config;
        if (cf.direction === -1) {
            baseLength = cf.currentNode * cf.offsetDelta + (-1) * cf.direction * this.bouncingThreshold;
        }
        else if (cf.direction === 1) {
            baseLength = -1 * (cf.currentNode * cf.offsetDelta + this.bouncingThreshold);
        }

        if (cf.currentNode === 0 && cf.currentDelta >= baseLength && cf.direction === -1) {
            cf.currentDelta = baseLength;
            
        }
        else if (cf.currentNode === cf.childrenLength - 1 && cf.currentDelta <=  baseLength  && cf.direction === 1) {
            cf.currentDelta =  baseLength;
        }

        cf.touchEndDistance = cf.currentDelta;
        var transform = (this.opt.isVertical) ? 'translate3d(0, ' + cf.currentDelta + 'px, 0)' 
                                              : 'translate3d(' + cf.currentDelta + 'px, 0, 0)';
        $.css(this.opt.wrapper, {'transform': transform});
    },
    ontouchend: function(ev, custVar) {
        var cf = this.config;
        var touchEndDistanceABS = Math.abs(cf.touchEndDistance);
        var baseLength = cf.currentNode * cf.offsetDelta + cf.direction * this.swipeThreshold;

        if (cf.currentNode !== 0 && cf.direction === -1 && touchEndDistanceABS <= baseLength) {
            this.slide(-1);
         }
        else if (cf.currentNode !== cf.childrenLength - 1 && cf.direction === 1 && touchEndDistanceABS >= baseLength) {
            this.slide(1);
        }
        else {
            this.slide(0);
        }
    },
    slide: function(num) {
        var cf = this.config;
        var option = this.opt;
        cf.currentNode += num;
        cf.currentDelta = -1 * cf.currentNode * cf.offsetDelta;
        var transform = (option.isVertical) ? 'translate3d(0, ' + cf.currentDelta + 'px, 0)' 
                        : 'translate3d(' + cf.currentDelta + 'px, 0, 0)';
        $.css(option.wrapper,
        {
            'transform': transform,
            'transition': '0.3s'
        });
        cf.touchEndDistance = 0;
        if (num !== 0 && option.swipe.onswipechange) {
            option.swipe.onswipechange(cf.currentNode);
        }
    }
};