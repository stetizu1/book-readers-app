import { CheckResultValue } from '../constants/errorMessages';
import { CheckMultiple } from '../types/CheckResult';

export const checkMultiple: CheckMultiple = (body, ...checks) => (
  checks
    .map((check) => check(body))
    .find((res) => (res !== CheckResultValue.success))
  || CheckResultValue.success
);
