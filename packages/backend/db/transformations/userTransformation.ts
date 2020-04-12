import { QueryResultRow } from 'pg';

import { UserData } from 'book-app-shared/types/UserData';


export const createUserFromDbRow = (row: QueryResultRow): UserData => ({
  id: row.id,
  email: row.email,
  publicProfile: row.publicprofile,

  name: row.name,
  description: row.description,
  image: row.image,
});
