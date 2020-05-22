import { InvalidParametersErrorMessage, Success } from '../constants/ErrorMessages';

export type CheckFunction<T extends object> = (body: T) => InvalidParametersErrorMessage | Success.checkSuccess;

export type ExportedCheckFunction<T extends object> = (body: unknown) => T;
