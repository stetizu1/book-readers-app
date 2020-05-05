import { makeStyles } from '@material-ui/core/styles';
import { CssFontColor, CssThemeColor } from 'app/constants/style/Colors';


export const useDialogColorStyle = makeStyles({
  box: {
    backgroundColor: CssThemeColor.greyBlue,
    color: CssFontColor.lightBlue,
  },
});
