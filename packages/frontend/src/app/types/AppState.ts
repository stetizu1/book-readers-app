import { DialogState } from 'app/modules/dialog/dialogReducer';
import { LoginState } from 'app/modules/login/loginReducer';
import { UserState } from 'app/modules/user/userReducer';
import { LibraryState } from 'app/modules/library/libraryReducer';
import { FriendshipState } from '../modules/friendship/friendshipReducer';
import { WishlistState } from '../modules/wishlist/wishlistReducer';


export type AppState = {
  dialogState: DialogState;

  loginState: LoginState;
  userState: UserState;
  libraryState: LibraryState;
  friendshipState: FriendshipState;
  wishlistState: WishlistState;
};
