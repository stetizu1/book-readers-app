import { CheckResultMessage } from '../constants/ErrorMessages';

export type CheckFunction<T extends object> = (body: T) => CheckResultMessage;

export type ExportedCheckFunction<T extends object> = (body: unknown) => T;
