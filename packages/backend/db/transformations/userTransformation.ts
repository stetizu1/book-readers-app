import { User, UserUpdate } from 'book-app-shared/types/User';

import { ConvertDbRow, ConvertToUpdate } from '../../types/db/TransformationTypes';


export const convertDbRowToUser: ConvertDbRow<User> = (row) => ({
  id: row.id,
  email: row.email,
  publicProfile: row.publicprofile,

  name: row.name,
  description: row.description,
  image: row.image,
});

export const convertUserToUserUpdate: ConvertToUpdate<User, UserUpdate> = (original) => ({
  publicProfile: original.publicProfile,
  name: original.name,
  description: original.description,
  image: original.image,
});
