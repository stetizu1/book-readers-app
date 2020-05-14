import { User, UserUpdate } from '../../types/User';
import { ConvertToUpdate } from '../../types/others/ConvertToUpdate';

export const convertUserToUserUpdate: ConvertToUpdate<User, UserUpdate> = (original) => ({
  publicProfile: original.publicProfile,
  name: original.name,
  description: original.description,
  image: original.image,
});
