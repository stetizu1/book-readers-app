import { ButtonType } from './types/ButtonType';

enum StyleVariant {
  text = 'text',
  outlined = 'outlined',
  contained = 'contained',
}


export const ButtonVariant = {
  [ButtonType.button]: StyleVariant.contained,
  [ButtonType.save]: StyleVariant.contained,
  [ButtonType.edit]: StyleVariant.contained,
  [ButtonType.delete]: StyleVariant.text,

  [ButtonType.dialogDelete]: StyleVariant.contained,
  [ButtonType.dialogCancel]: StyleVariant.text,

  [ButtonType.logout]: StyleVariant.text,
};
