import { CheckResultValue } from '../constants/errorMessages';

interface CheckResult<T extends object> {
  checked: T | false;
  checkError?: Error;
}

export type CheckFunction<T extends object> = (body: unknown, errPrefix: string, errPostfix: string) => CheckResult<T>;

export type ConstructCheckFail = <T extends object>(message: CheckResultValue, errPrefix: string, errPostfix: string) => CheckResult<T>;

export type ConstructCheckSuccess = <T extends object>(body: T) => CheckResult<T>;

export type ConstructCheck = <T extends object>(body: T, message: CheckResultValue, errPrefix: string, errPostfix: string) => CheckResult<T>;

export type CheckMultiple = <T>(body: T, ...checks: MessageCheckFunction<T>[]) => CheckResultValue;

export type MessageCheckFunction<T> = (body: T) => CheckResultValue;
