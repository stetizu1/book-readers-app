interface CheckResult<T> {
  checked: T | false;
  checkError?: Error;
}

export type CheckFunction<T> = (body: unknown, errPrefix: string, errPostfix: string) => CheckResult<T>;
