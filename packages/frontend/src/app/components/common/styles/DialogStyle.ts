import { makeStyles } from '@material-ui/core/styles';
import { CssThemeTransparentColor } from '../../../constants/Css';


export const useDialogStyle = makeStyles({
  background: {
    backgroundColor: CssThemeTransparentColor.lightBlue,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  forward: {
    zIndex: 101,
    position: 'absolute',
    maxWidth: '500px',
    top: '135px',
    marginLeft: 'auto',
    marginRight: 'auto',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});
