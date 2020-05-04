import { makeStyles } from '@material-ui/core/styles';
import { CssFontColor, CssThemeColor } from '../../../constants/Css';

export const useDialogColorStyle = makeStyles({
  box: {
    backgroundColor: CssThemeColor.greyBlue,
    color: CssFontColor.lightBlue,
  },
});
