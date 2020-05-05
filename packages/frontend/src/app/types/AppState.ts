import { DialogState } from 'app/modules/dialog/dialogReducer';
import { LoginState } from 'app/modules/login/loginReducer';
import { UserState } from 'app/modules/user/userReducer';


export type AppState = {
  dialogState: DialogState;

  loginState: LoginState;
  userState: UserState;
};
