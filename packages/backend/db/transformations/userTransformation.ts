import { UserData, UserDataUpdate } from 'book-app-shared/types/UserData';

import { CreateFromDbRow, TransformToUpdate } from '../../types/db/TransformationTypes';


export const createUserFromDbRow: CreateFromDbRow<UserData> = (row) => ({
  id: row.id,
  email: row.email,
  publicProfile: row.publicprofile,

  name: row.name,
  description: row.description,
  image: row.image,
});

export const transformUserUpdateFromUser: TransformToUpdate<UserData, UserDataUpdate> = (original) => ({
  publicProfile: original.publicProfile,
  name: original.name,
  description: original.description,
  image: original.image,
});
