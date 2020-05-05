import { Auth } from 'book-app-shared/constants/Authorization';
import { JwtToken } from 'book-app-shared/types/others/aliases';

import { api } from 'app/api/apiClient';


const createHeaderValue = (jwtToken: JwtToken): string => `${Auth.prefix} ${jwtToken}`;

interface AxiosToken {
  set: (jwtToken: JwtToken) => void;
  remove: () => void;
}

export const axiosToken: AxiosToken = {
  set: (jwtToken) => {
    api.defaults.headers.Authorization = createHeaderValue(jwtToken);
  },

  remove: () => {
    api.defaults.headers.Authorization = undefined;
  },
};
