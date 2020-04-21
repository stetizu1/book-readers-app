import { User, UserUpdate } from 'book-app-shared/types/User';

import { CreateFromDbRow, TransformToUpdate } from '../../types/db/TransformationTypes';


export const createUserFromDbRow: CreateFromDbRow<User> = (row) => ({
  id: row.id,
  email: row.email,
  publicProfile: row.publicprofile,

  name: row.name,
  description: row.description,
  image: row.image,
});

export const transformUserUpdateFromUser: TransformToUpdate<User, UserUpdate> = (original) => ({
  publicProfile: original.publicProfile,
  name: original.name,
  description: original.description,
  image: original.image,
});
