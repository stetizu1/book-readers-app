import { UserCreate } from 'book-app-shared/types/User';

export const getUserCreateDefault = (email: string | undefined, googleToken: string | undefined): UserCreate => ({
  email: email || '',
  publicProfile: false,
  googleToken: googleToken || '',
});
