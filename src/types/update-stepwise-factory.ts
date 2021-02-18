import { TUpdateFunction } from './update-function';

export type TUpdateStepwiseFactory = (tolerance: number, stepwiseDelay: number) => TUpdateFunction;
