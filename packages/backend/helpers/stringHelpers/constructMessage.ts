import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ErrorMethodMessage, ErrorParamGivenMessage } from '../../constants/ErrorMessages';
import { Message } from '../../constants/Message';

/**
 * Connects given arguments with whitespace separator.
 * @param args - string or undefined values to join.
 */
export const composeMessage = (...args: (string | undefined)[]): string => (
  args
    .filter((arg) => !isUndefined(arg))
    .join(' ')
);

type ErrPrefixAndPostfix = {
  errPrefix: string;
  errPostfix: string;
};

interface GetErrorPrefixAndPostfix {
  create: (repoName: string, body: unknown) => ErrPrefixAndPostfix;
  read: (repoName: string, id: number) => ErrPrefixAndPostfix;
  readAll: (repoName: string) => ErrPrefixAndPostfix;
  update: (repoName: string, id: number, body: unknown) => ErrPrefixAndPostfix;
  delete: (repoName: string, id: number) => ErrPrefixAndPostfix;
}

/**
 * Returns prefix and postfix for errors generated depending on required method. Prefix and postfix are used for better orientation where error occurred.
 */
export const getErrorPrefixAndPostfix: GetErrorPrefixAndPostfix = {
  create: (repoName, body) => ({
    errPrefix: composeMessage(repoName, Message.error, ErrorMethodMessage.Create),
    errPostfix: composeMessage(ErrorParamGivenMessage.Structure, JSON.stringify(body)),
  }),

  read: (repoName, id) => ({
    errPrefix: composeMessage(repoName, Message.error, ErrorMethodMessage.Read),
    errPostfix: composeMessage(ErrorParamGivenMessage.Id, String(id)),
  }),

  readAll: (repoName) => ({
    errPrefix: composeMessage(repoName, Message.error, ErrorMethodMessage.ReadAll),
    errPostfix: '',
  }),

  update: (repoName, id, body) => ({
    errPrefix: composeMessage(repoName, Message.error, ErrorMethodMessage.Update),
    errPostfix: composeMessage(ErrorParamGivenMessage.Id, String(id), ErrorParamGivenMessage.Structure, JSON.stringify(body)),
  }),

  delete: (repoName, id) => ({
    errPrefix: composeMessage(repoName, Message.error, ErrorMethodMessage.Delete),
    errPostfix: composeMessage(ErrorParamGivenMessage.Id, String(id), ErrorParamGivenMessage.Structure),
  }),
};
