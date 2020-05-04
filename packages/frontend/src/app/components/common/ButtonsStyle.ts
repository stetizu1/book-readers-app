import { makeStyles } from '@material-ui/core/styles';

import { CssFontColor, CssButtonColors, CssButtonHoverColors } from '../../constants/Css';


export const useButtonStyle = makeStyles({
  save: {
    backgroundColor: CssButtonColors.save,
    '&:hover': {
      backgroundColor: CssButtonHoverColors.save,
    },
  },
  edit: {
    color: CssFontColor.blue,
    backgroundColor: CssButtonColors.edit,
    '&:hover': {
      backgroundColor: CssButtonHoverColors.edit,
    },
  },
  delete: {
    color: CssButtonColors.deleteText,
    fontSize: 'small',
    '&:hover': {
      color: CssButtonHoverColors.deleteText,
    },
  },
});
