import { Auth } from 'book-app-shared/constants/Authorization';

import { api } from '../../api/apiClient';


const createHeaderValue = (token: string): string => `${Auth.prefix} ${token}`;

export const axiosToken = {
  set: (token: string): void => {
    api.defaults.headers.Authorization = createHeaderValue(token);
  },

  remove: (): void => {
    api.defaults.headers.Authorization = '';
  },
};
