import { ITimingObject } from 'timing-object';
import { TPrepareTimingStateVectorFunction } from './prepare-timing-state-vector-function';
import { IUpdateSettings } from './update-settings';

export type TSetTimingsrcFunction = (
    mediaElement: HTMLMediaElement,
    timingObject: ITimingObject,
    updateSettings: IUpdateSettings,
    prepareTimingStateVector?: null | TPrepareTimingStateVectorFunction
) => () => void;
