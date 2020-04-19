import { CheckResultValue } from '../constants/errorMessages';

interface CheckResult<T> {
  checked: T | false;
  checkError?: Error;
}

export type CheckFunction<T> = (body: unknown, errPrefix: string, errPostfix: string) => CheckResult<T>;

export type ConstructCheckFail = <T>(message: CheckResultValue, errPrefix: string, errPostfix: string) => CheckResult<T>;

export type ConstructCheckSuccess = <T>(body: T) => CheckResult<T>;

export type ConstructCheck = <T>(body: T, message: CheckResultValue, errPrefix: string, errPostfix: string) => CheckResult<T>;

export type CheckMultiple = <T>(body: T, ...checks: MessageCheckFunction<T>[]) => CheckResultValue;

export type MessageCheckFunction<T> = (body: T) => CheckResultValue;
