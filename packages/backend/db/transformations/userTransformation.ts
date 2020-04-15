import { UserData } from 'book-app-shared/types/UserData';

import { CreateFromDbRow } from '../createFromDbRow';


export const createUserFromDbRow: CreateFromDbRow<UserData> = (row) => ({
  id: row.id,
  email: row.email,
  publicProfile: row.publicprofile,

  name: row.name,
  description: row.description,
  image: row.image,
});
