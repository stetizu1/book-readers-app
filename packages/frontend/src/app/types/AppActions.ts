import { LoginAction } from 'app/modules/login/loginAction';
import { DialogAction } from 'app/modules/dialog/dialogAction';
import { UserAction } from 'app/modules/user/userAction';
import { LibraryAction } from 'app/modules/library/libraryAction';
import { FriendshipAction } from 'app/modules/friendship/friendshipAction';
import { WishlistAction } from 'app/modules/wishlist/wishlistAction';


export type AppActions = DialogAction | LoginAction | UserAction | LibraryAction | FriendshipAction | WishlistAction;
