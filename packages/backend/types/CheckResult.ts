interface CheckResult<T> {
  checked: T | false;
  checkError?: Error;
}
