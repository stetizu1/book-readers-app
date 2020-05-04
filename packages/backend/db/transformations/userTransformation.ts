import { User } from 'book-app-shared/types/User';

import { ConvertDbRow } from '../../types/db/TransformationTypes';


export const convertDbRowToUser: ConvertDbRow<User> = (row) => ({
  id: row.id,
  email: row.email,
  publicProfile: row.publicprofile,

  name: row.name,
  description: row.description,
  image: row.image,
});
