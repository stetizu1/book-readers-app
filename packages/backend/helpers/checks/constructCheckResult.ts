import { getHttpError } from '../errors/getHttpError';
import { ConstructCheck, ConstructCheckFail, ConstructCheckSuccess } from '../../types/CheckResult';
import { CheckResultMessage } from '../../constants/ErrorMessages';

/**
 * Wraps unsuccessful result to failure check result.
 * @param message - message returned from check
 * @param errPrefix - prefix to construct error
 * @param errPostfix - postfix to construct error
 */
export const constructCheckResultFail: ConstructCheckFail = (message, errPrefix, errPostfix) => ({
  checked: false,
  checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, message),
});

/**
 * Wraps successful check result to success check result.
 * @param body - typed object that was checked
 */
export const constructCheckResultSuccess: ConstructCheckSuccess = (body) => ({ checked: body });

/**
 * Wraps check result depending on the message provided to success or failure check result.
 * @param body - typed object that was checked
 * @param message - message returned from check
 * @param errPrefix - prefix to construct possible error
 * @param errPostfix - postfix to construct possible error
 */
export const constructCheckResult: ConstructCheck = (body, message, errPrefix, errPostfix) => (
  message === CheckResultMessage.success
    ? constructCheckResultSuccess(body)
    : constructCheckResultFail(message, errPrefix, errPostfix)
);
