import { TSetTimingsrcFactory } from '../types';

export const createSetTimingsrc: TSetTimingsrcFactory = (
    createUpdateGradually,
    createUpdateStepwise,
    setTimingsrcWithCustomUpdateFunction
) => {
    return (mediaElement, timingObject, updateSettings, prepareTimingStateVector = null) => {
        const THRESHOLD = updateSettings.threshold;
        const TIME_CONSTANT = updateSettings.timeConstant;
        const TOLERANCE = updateSettings.tolerance;
        const updateFun = updateSettings.isGradually
            ? createUpdateGradually(TIME_CONSTANT, THRESHOLD, TOLERANCE)
            : createUpdateStepwise(TOLERANCE);

        return setTimingsrcWithCustomUpdateFunction(mediaElement, timingObject, updateFun, prepareTimingStateVector);
    };
};
