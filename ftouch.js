/**
 * Created by heyli on 2015/1/4.
 */

var ftouch = (function($win) {
    try {
        var self = this;

        var opt = {
            wrapper: $win.document.body,
            isVertical: false
        };

        var _startTime = 0;
        var _endTime = 0;
        var _initialResizeDistance = 0;
        var _wrapperWidth = opt.wrapper.clientWidth;
        var _wrapperHeight = opt.wrapper.clientHeight;
        var _setScale = 1;

        /**
         * initialization
         */
        var init = function () {
            bindTouchHandler();
        };

        /**
         * trigger customized events or callbacks
         * @param evType
         * @param params
         */
        var triggerEvent = function (evType, params) {
            if (typeof  returnObj[evType] === 'function') {

                returnObj[evType].apply(returnObj, params);
            }
        };

        /**
         * reset value
         */
        var reset = function () {
            _startTime = 0;
            _endTime = 0;
            _initialResizeDistance = 0;
        };

        /**
         * bind touch event
         */
        var bindTouchHandler = function () {
            var wrapper = opt.wrapper;
            var startPos = null;
            var movePos = null;
            var changedPos = null;
            var fingerNum = 0;
            var changedFingerNum = 0;
            var centerPos = null;
            var resetInterval = null;

            wrapper.addEventListener('touchstart', function (ev) {
                ev.preventDefault();
                _startTime = new Date().getTime();
                startPos = ev.touches;
                fingerNum = startPos.length;

                triggerEvent('touchStartCallback', [startPos.length]);
            });

            wrapper.addEventListener('touchmove', function (ev) {
                ev.preventDefault();
                movePos = ev.touches;
                changedPos = ev.changedTouches;
                changedFingerNum = changedPos.length;
                var resizeDistance = 0;

                document.getElementById('touchchangedFingers').innerHTML = 'changedFingerNum: ' + changedFingerNum;
                if (fingerNum === 1) {
                    getSwipeDistance(startPos[0], movePos[0]);
                }
                else if (fingerNum === 2) {
                    centerPos = startPos[0];

                    if (_initialResizeDistance == 0) {
                        _initialResizeDistance = getResizeDistance(changedPos[0], changedPos[1]);
                        document.getElementById('initialResizeDistance').innerHTML = 'initialResizeDistance: ' + _initialResizeDistance;
                        resetInterval = setInterval(function() {
                            _initialResizeDistance = getResizeDistance(changedPos[0], changedPos[1]);
                        }, 100);
                    }
                    else {
                        resizeDistance = getResizeDistance(changedPos[0], changedPos[1]);
                        document.getElementById('resizeDistance').innerHTML = 'resizeDistance: ' + resizeDistance;
                        getResizePercentage(_initialResizeDistance, resizeDistance);
                        setScale(centerPos, _setScale);
                        document.getElementById('scalePercent').innerHTML = 'scalePercent: ' + _setScale;
                        document.getElementById('percent').innerHTML = 'percent: ' + percentage;
                    }
                }
            });

            wrapper.addEventListener('touchend', function (ev) {
                ev.preventDefault();
                _endTime = new Date().getTime();
                reset();
                clearInterval(resetInterval);
                resetSize();
                console.log('touchend');
            });
        };

        var getSwipeDistance = function (pos1, pos2) {
            var distance = (opt.isVertical) ? ( pos2.pageY - pos1.pageY) : (pos2.pageX - pos1.pageX);
            document.getElementById('distance').innerHTML = 'vertical: ' + opt.isVertical + ' distance: ' + distance;
            return distance;
        };

        var getResizeDistance = function (pos1, pos2) {
            var distance = Math.sqrt(Math.pow((pos1.pageX - pos2.pageX), 2) + Math.pow((pos1.pageY - pos2.pageY), 2));
            return distance;
        };

        var getResizePercentage = function(initResizeDist, changedResizeDist) {
            var percentage = changedResizeDist / initResizeDist;
            if (percentage < 1) {
                percentage *= -1;
                percentage *= 0.1;
            }
            else {
                percentage -= 1;
                percentage *= 0.3;
            }


            _setScale += percentage;

            if (_setScale >= 5) {
                _setScale = 5;
            }
            else if (_setScale <= 0.8){
                _setScale = 0.8;
            }
        };

        var resetSize = function() {
            if (_setScale < 1) {
                wrapper.style.webkitTransform = 'scale(1, 1)';
            }
        }

        var setScale = function(centerPos, percentage) {
            wrapper.style.webkitTransformOrigin = (centerPos.pageX / _wrapperWidth * 100) + '% ' + (centerPos.pageY / _wrapperHeight * 100) + '%';
            document.getElementById('centerPos').innerHTML =  wrapper.style.webkitTransformOrigin;
            wrapper.style.webkitTransform = 'scale(' + percentage + ', ' + percentage + ')';
        };

        var returnObj = {
            opt: opt,
            init: init
        };

        return returnObj;
    }
    catch (e) {
        alert(e);
    }

})(window);