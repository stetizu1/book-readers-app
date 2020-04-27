import { CheckResultMessage } from '../constants/ErrorMessages';

export type CheckFunction<T> = (body: T) => CheckResultMessage;

export type ExportedCheckFunction<T extends object> = (body: unknown, errPrefix: string, errPostfix: string) => T;
