import { makeStyles } from '@material-ui/core/styles';
import { CssFontColor, CssThemeColor } from '../../../../constants/style/Colors';


export const useFormCardStyle = makeStyles({
  paper: {
    width: '100%',
    margin: '10px 0',
    maxWidth: '500px',
    backgroundColor: CssThemeColor.greyBlue,
    color: CssFontColor.lightBlue,
  },
  content: {
    padding: '0 50px',
  },
});
