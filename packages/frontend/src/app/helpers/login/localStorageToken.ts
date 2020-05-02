const LOCAL_STORAGE_KEY = 'book-app-user-token';

export const localStorageToken = {
  get: (): string | null => localStorage.getItem(LOCAL_STORAGE_KEY),

  set: (token: string): void => localStorage.setItem(LOCAL_STORAGE_KEY, token),

  remove: (): void => localStorage.removeItem(LOCAL_STORAGE_KEY),
};
