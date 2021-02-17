import { animationFrame } from 'subscribable-things';
import { translateTimingStateVector } from 'timing-object';
import { createSetTimingsrc } from './factories/set-timingsrc';
import { createSetTimingsrcWithCustomUpdateFunction } from './factories/set-timingsrc-with-custom-update-function';
import { createUpdateGradually } from './factories/update-gradually';
import { createUpdateStepwiseFactory } from './factories/update-stepwise-factory';
import { pause } from './functions/pause';
import { play } from './functions/play';

export { createUpdateGradually };

export const createUpdateStepwise = createUpdateStepwiseFactory(translateTimingStateVector);

export const setTimingsrcWithCustomUpdateFunction = createSetTimingsrcWithCustomUpdateFunction(animationFrame, pause, play);

export const setTimingsrc = createSetTimingsrc(createUpdateGradually, createUpdateStepwise, setTimingsrcWithCustomUpdateFunction);
