import { CheckResultMessage } from '../../constants/ErrorMessages';
import { CheckMultiple } from '../../types/CheckResult';

/**
 * Executes all given check functions and returns first fail or success.
 * @param body - structure to be checked
 * @param checks - check functions to be executed
 * @return CheckResultMessage error or CheckResultMessage.success
 */
export const checkMultiple: CheckMultiple = (body, ...checks) => (
  checks
    .map((check) => check(body))
    .find((res) => (res !== CheckResultMessage.success))
  || CheckResultMessage.success
);
