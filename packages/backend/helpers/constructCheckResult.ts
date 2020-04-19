import { getHttpError } from './getHttpError';
import { ConstructCheck, ConstructCheckFail, ConstructCheckSuccess } from '../types/CheckResult';
import { CheckResultValue } from '../constants/errorMessages';

export const constructCheckResultFail: ConstructCheckFail = (message, errPrefix, errPostfix) => ({
  checked: false,
  checkError: getHttpError.getInvalidParametersError(errPrefix, errPostfix, message),
});

export const constructCheckResultSuccess: ConstructCheckSuccess = (body) => ({ checked: body });

export const constructCheckResult: ConstructCheck = (body, message, errPrefix, errPostfix) => (
  message === CheckResultValue.success
    ? constructCheckResultSuccess(body)
    : constructCheckResultFail(message, errPrefix, errPostfix)
);
