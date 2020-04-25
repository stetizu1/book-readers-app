import { CheckResultMessage } from '../../constants/ErrorMessages';
import { MessageCheckFunction } from '../../types/CheckResult';

/**
 * Merges given check functions into one.
 * @param checks - check functions to merge
 * @return CheckResultMessage error or CheckResultMessage.success
 */
export const checkMultiple = <T>(...checks: MessageCheckFunction<T>[]): MessageCheckFunction<T> => (
  (body): CheckResultMessage => (
    checks
      .map((check) => check(body))
      .find((res) => (res !== CheckResultMessage.success))
    || CheckResultMessage.success
  )
);
