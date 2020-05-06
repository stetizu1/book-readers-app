import { LoginAction } from 'app/modules/login/loginAction';
import { DialogAction } from 'app/modules/dialog/dialogAction';
import { UserAction } from 'app/modules/user/userAction';
import { LibraryAction } from 'app/modules/library/libraryAction';


export type AppActions = DialogAction | LoginAction | UserAction | LibraryAction;
