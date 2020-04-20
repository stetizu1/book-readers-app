import { CheckResultMessage } from '../constants/ErrorMessages';

interface CheckResultFailure {
  checked: false;
  checkError: Error;
}

interface CheckResultSuccess<T extends object> {
  checked: T;
  checkError?: undefined;
}

type CheckResult<T extends object> = CheckResultSuccess<T> | CheckResultFailure;


export type CheckFunction<T extends object> = (body: unknown, errPrefix: string, errPostfix: string) => CheckResult<T>;

export type ConstructCheckFail = <T extends object>(message: CheckResultMessage, errPrefix: string, errPostfix: string) => CheckResult<T>;

export type ConstructCheckSuccess = <T extends object>(body: T) => CheckResult<T>;

export type ConstructCheck = <T extends object>(body: T, message: CheckResultMessage, errPrefix: string, errPostfix: string) => CheckResult<T>;

export type CheckMultiple = <T>(body: T, ...checks: MessageCheckFunction<T>[]) => CheckResultMessage;

export type MessageCheckFunction<T> = (body: T) => CheckResultMessage;
