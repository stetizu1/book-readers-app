import { makeStyles } from '@material-ui/core/styles';

import { CssFontColor, CssButtonColors, CssButtonHoverColors } from '../../../constants/Css';


export const useButtonStyle = makeStyles({
  containerMultiple: {
    display: 'flex',
    alignItems: 'flex-end',
    '& > *': {
      margin: '0 10px',
    },
  },
  containerOposite: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '50px',
    '& > *': {
      margin: '10px 30px',
    },
  },
  save: {
    backgroundColor: CssButtonColors.save,
    '&:hover': {
      color: CssButtonHoverColors.saveText,
      backgroundColor: CssButtonHoverColors.save,
    },
  },
  edit: {
    color: CssFontColor.blue,
    backgroundColor: CssButtonColors.edit,
    '&:hover': {
      color: CssButtonHoverColors.editText,
      backgroundColor: CssButtonHoverColors.edit,
    },
  },
  deleteButton: {
    color: CssButtonColors.deleteButtonText,
    backgroundColor: CssButtonColors.deleteButton,
    fontSize: 'small',
    '&:hover': {
      color: CssButtonHoverColors.deleteButtonText,
      backgroundColor: CssButtonHoverColors.deleteButton,
    },
  },
  deleteOption: {
    color: CssButtonColors.deleteText,
    fontSize: 'small',
    '&:hover': {
      color: CssButtonHoverColors.deleteText,
      backgroundColor: CssButtonHoverColors.delete,
    },
  },
  cancel: {
    color: CssButtonColors.cancelText,
    fontSize: 'small',
    '&:hover': {
      color: CssButtonHoverColors.cancelText,
      backgroundColor: CssButtonHoverColors.cancel,
    },
  },
  logout: {
    color: CssButtonColors.deleteText,
    fontSize: 'small',
    '&:hover': {
      color: CssButtonHoverColors.deleteText,
      backgroundColor: 'transparent',
    },
  },
});
