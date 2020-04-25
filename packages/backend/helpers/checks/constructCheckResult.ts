import { isUndefined, TypeCheckFunction } from 'book-app-shared/helpers/typeChecks';
import { CheckResultMessage } from '../../constants/ErrorMessages';
import { MessageCheckFunction } from '../../types/CheckResult';
import { normalizeCreateObject, normalizeUpdateObject } from '../db/normalizeStructure';
import { getHttpError } from '../errors/getHttpError';

const check = <T>(
  checkType: TypeCheckFunction<T>,
  checkWithMessage: MessageCheckFunction<T> | undefined,
  normalized: unknown,
  errPrefix: string, errPostfix: string,
): T => {
  if (checkType(normalized)) {
    const result = !isUndefined(checkWithMessage) ? checkWithMessage(normalized) : CheckResultMessage.success;
    if (result === CheckResultMessage.success) {
      return normalized;
    }
    throw getHttpError.getInvalidParametersError(result, errPrefix, errPostfix);
  }
  throw getHttpError.getInvalidParametersError(CheckResultMessage.invalidType, errPrefix, errPostfix);
};

export const checkCreate = <T>(
  checkType: TypeCheckFunction<T>,
  checkWithMessage: MessageCheckFunction<T> | undefined,
  body: unknown,
  errPrefix: string, errPostfix: string,
): T => {
  const normalized = normalizeCreateObject(body);
  return check(checkType, checkWithMessage, normalized, errPrefix, errPostfix);
};

export const checkUpdate = <T>(
  checkType: TypeCheckFunction<T>,
  checkWithMessage: MessageCheckFunction<T> | undefined,
  body: unknown,
  errPrefix: string, errPostfix: string,
): T => {
  const normalized = normalizeUpdateObject(body);
  return check(checkType, checkWithMessage, normalized, errPrefix, errPostfix);
};
