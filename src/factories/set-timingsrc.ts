import { TSetTimingsrcFactory } from '../types';

export const createSetTimingsrc: TSetTimingsrcFactory = (
    createUpdateGradually,
    createUpdateStepwise,
    setTimingsrcWithCustomUpdateFunction
) => {
    return (mediaElement, timingObject, updateSettings, prepareTimingStateVector = null) => {
        const threshold = updateSettings.threshold;
        const timeConstant = updateSettings.timeConstant;
        const tolerance = updateSettings.tolerance;
        const stepwiseDelay = updateSettings.stepwiseDelay;
        const updateFun = updateSettings.isGradually
            ? createUpdateGradually(timeConstant, threshold, tolerance)
            : createUpdateStepwise(tolerance, stepwiseDelay);

        return setTimingsrcWithCustomUpdateFunction(mediaElement, timingObject, updateFun, prepareTimingStateVector);
    };
};
