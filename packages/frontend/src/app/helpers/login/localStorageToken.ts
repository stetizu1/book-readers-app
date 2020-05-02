import { JwtToken } from 'book-app-shared/types/others/aliases';

const LOCAL_STORAGE_KEY = 'book-app-user-token';

interface LocalStorageToken {
  set: (jwtToken: JwtToken) => void;
  get: () => string | null;
  remove: () => void;
}

export const localStorageToken: LocalStorageToken = {
  set: (jwtToken) => localStorage.setItem(LOCAL_STORAGE_KEY, jwtToken),

  get: () => localStorage.getItem(LOCAL_STORAGE_KEY),

  remove: () => localStorage.removeItem(LOCAL_STORAGE_KEY),
};
