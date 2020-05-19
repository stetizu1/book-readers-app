import { makeStyles } from '@material-ui/core/styles';
import { CssFontColor, CssThemeColor, CssThemeTransparentColor } from 'app/constants/style/Colors';


export const useConfirmationDialogStyle = makeStyles({
  background: {
    backgroundColor: CssThemeTransparentColor.lightBlueDialog,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  foreground: {
    position: 'absolute',
    top: '135px',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',

    maxWidth: '500px',
    padding: '15px',

    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',

    backgroundColor: CssThemeColor.greyBlue,
    color: CssFontColor.lightBlue,
    zIndex: 101,
  },
});
