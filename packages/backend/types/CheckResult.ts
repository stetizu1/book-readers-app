import { CheckResultMessage } from '../constants/ErrorMessages';

export type MessageCheckFunction<T> = (body: T) => CheckResultMessage;

export type CheckFunction<T extends object> = (body: unknown, errPrefix: string, errPostfix: string) => T;
