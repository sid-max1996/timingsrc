(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('subscribable-things'), require('timing-object'), require('@babel/runtime/helpers/defineProperty')) :
    typeof define === 'function' && define.amd ? define(['exports', 'subscribable-things', 'timing-object', '@babel/runtime/helpers/defineProperty'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.timingsrc = {}, global.subscribableThings, global.timingObject, global._defineProperty));
}(this, (function (exports, subscribableThings, timingObject, _defineProperty) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var _defineProperty__default = /*#__PURE__*/_interopDefaultLegacy(_defineProperty);

    var createSetTimingsrc = function createSetTimingsrc(createUpdateGradually, createUpdateStepwise, setTimingsrcWithCustomUpdateFunction) {
      return function (mediaElement, timingObject, updateSettings) {
        var prepareTimingStateVector = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var THRESHOLD = updateSettings.threshold;
        var TIME_CONSTANT = updateSettings.timeConstant;
        var TOLERANCE = updateSettings.tolerance;
        var updateFun = updateSettings.isGradually ? createUpdateGradually(TIME_CONSTANT, THRESHOLD, TOLERANCE) : createUpdateStepwise(TOLERANCE);
        return setTimingsrcWithCustomUpdateFunction(mediaElement, timingObject, updateFun, prepareTimingStateVector);
      };
    };

    var createSetTimingsrcWithCustomUpdateFunction = function createSetTimingsrcWithCustomUpdateFunction(animationFrame, pause, play) {
      return function (mediaElement, timingObject, updateFunction) {
        var prepareTimingStateVector = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        return animationFrame()(function () {
          var currentTime = mediaElement.currentTime,
              duration = mediaElement.duration,
              playbackRate = mediaElement.playbackRate;
          var timingStateVector = timingObject.query();

          var _updateFunction = updateFunction(prepareTimingStateVector === null ? timingStateVector : prepareTimingStateVector(timingStateVector), currentTime),
              position = _updateFunction.position,
              velocity = _updateFunction.velocity;

          var sanitizedDuration = typeof duration === 'number' && !isNaN(duration) ? duration : 0;

          if (currentTime !== position) {
            if (position < 0) {
              mediaElement.currentTime = 0;
              pause(mediaElement);
            } else if (position > sanitizedDuration) {
              mediaElement.currentTime = duration;
              pause(mediaElement);
            } else {
              mediaElement.currentTime = position;

              if (velocity !== 0) {
                if (playbackRate !== velocity) {
                  mediaElement.playbackRate = velocity;
                }

                play(mediaElement);
              } else {
                pause(mediaElement);
              }
            }
          }
        });
      };
    };

    var createUpdateGradually = function createUpdateGradually(timeConstant, threshold, tolerance) {
      return function (timingStateVector, currentTime) {
        if (timingStateVector.position < 0 || timingStateVector.velocity === 0) {
          return {
            position: timingStateVector.position,
            velocity: timingStateVector.velocity
          };
        }

        var positionDifference = Math.abs(currentTime - timingStateVector.position);

        if (positionDifference > threshold) {
          return {
            position: timingStateVector.position,
            velocity: timingStateVector.velocity
          };
        }

        if (positionDifference > tolerance) {
          return {
            position: currentTime,
            velocity: (positionDifference + timeConstant) / timeConstant * timingStateVector.velocity
          };
        }

        return {
          position: currentTime,
          velocity: timingStateVector.velocity
        };
      };
    };

    function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

    function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty__default['default'](target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

    var createUpdateStepwiseFactory = function createUpdateStepwiseFactory(translateTimingStateVector) {
      return function (tolerance) {
        var lastMotionUpdate = null;
        var mediaElementDelay = 0;
        return function (timingStateVector, currentTime) {
          if (timingStateVector.position < 0 || timingStateVector.velocity === 0) {
            lastMotionUpdate = null;
            return {
              position: timingStateVector.position,
              velocity: timingStateVector.velocity
            };
          }

          if (lastMotionUpdate !== null) {
            var playheadDifference = Math.abs(currentTime - lastMotionUpdate.position); // Check if at least 10ms were played since the last motion update.

            if (playheadDifference < 0.01) {
              return {
                position: currentTime,
                velocity: lastMotionUpdate.velocity
              };
            }
          }

          var positionDifference = Math.abs(currentTime - timingStateVector.position);

          if (positionDifference > tolerance) {
            if (lastMotionUpdate !== null) {
              var elapsedTime = timingStateVector.timestamp - lastMotionUpdate.timestamp;

              var _translateTimingState = translateTimingStateVector(_objectSpread({
                acceleration: 0
              }, lastMotionUpdate), elapsedTime),
                  position = _translateTimingState.position;

              mediaElementDelay = position - currentTime;
            }

            var positioWithDelay = timingStateVector.position + mediaElementDelay;
            lastMotionUpdate = {
              position: positioWithDelay,
              timestamp: timingStateVector.timestamp,
              velocity: timingStateVector.velocity
            };
            return {
              position: positioWithDelay,
              velocity: timingStateVector.velocity
            };
          }

          lastMotionUpdate = null;
          return {
            position: currentTime,
            velocity: timingStateVector.velocity
          };
        };
      };
    };

    var pause = function pause(mediaElement) {
      if (!mediaElement.paused) {
        mediaElement.pause();
      }
    };

    var play = function play(mediaElement) {
      if (mediaElement.paused) {
        mediaElement.play()["catch"](function (err) {
          return console.error(err);
        }); // tslint:disable-line no-console
      }
    };

    var createUpdateStepwise = createUpdateStepwiseFactory(timingObject.translateTimingStateVector);
    var setTimingsrcWithCustomUpdateFunction = createSetTimingsrcWithCustomUpdateFunction(subscribableThings.animationFrame, pause, play);
    var setTimingsrc = createSetTimingsrc(createUpdateGradually, createUpdateStepwise, setTimingsrcWithCustomUpdateFunction);

    exports.createUpdateGradually = createUpdateGradually;
    exports.createUpdateStepwise = createUpdateStepwise;
    exports.setTimingsrc = setTimingsrc;
    exports.setTimingsrcWithCustomUpdateFunction = setTimingsrcWithCustomUpdateFunction;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
