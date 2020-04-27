import {
  UserCreate, isUserCreate,
  UserUpdateWithPassword, isUserUpdate,
} from 'book-app-shared/types/User';
import { isValidEmail } from 'book-app-shared/helpers/validators';

import { CheckResultMessage } from '../constants/ErrorMessages';
import { CheckFunction, ExportedCheckFunction } from '../types/CheckResult';
import { executeCheckCreate, executeCheckUpdate } from '../helpers/checks/constructCheckResult';


const checkCreate: CheckFunction<UserCreate> = (body) => {
  const { email } = body;
  if (!isValidEmail(email)) {
    return CheckResultMessage.invalidEmail;
  }
  return CheckResultMessage.success;
};

export const checkUserCreate: ExportedCheckFunction<UserCreate> = (body) => (
  executeCheckCreate(body, isUserCreate, checkCreate)
);

export const checkUserUpdate: ExportedCheckFunction<UserUpdateWithPassword> = (body) => (
  executeCheckUpdate(body, isUserUpdate)
);
