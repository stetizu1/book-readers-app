import { ButtonType } from '../constants/style/types/ButtonType';

export enum ButtonMessage {
  Detail = 'Podrobnosti',

  Save = 'Uložit',
  Edit = 'Editovat',
  Delete = 'Odstranit',

  DialogConfirm = 'Potvrdit',
  DialogCancel = 'Zrušit',

  LogoutText = 'Odhlásit se',

  LoginText = 'Přihlásit se',
  RegisterText = 'Zaregistrovat se',
  DeleteProfile = 'Odstranit profil',
  Labels = 'Správa štítků',
  AddBook = 'Přidat knihu',
  AddLabel = 'Přidat štítek',
}

export const DefaultButtonMessage = {
  [ButtonType.button]: ButtonMessage.Detail,

  [ButtonType.save]: ButtonMessage.Save,
  [ButtonType.edit]: ButtonMessage.Edit,
  [ButtonType.delete]: ButtonMessage.Delete,

  [ButtonType.dialogDelete]: ButtonMessage.DialogConfirm,
  [ButtonType.dialogCancel]: ButtonMessage.DialogCancel,

  [ButtonType.logout]: ButtonMessage.LogoutText,

};
