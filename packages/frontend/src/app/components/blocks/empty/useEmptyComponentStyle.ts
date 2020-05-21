import { makeStyles } from '@material-ui/core/styles';
import { CssThemeColor } from 'app/constants/style/Colors';


export const useEmptyComponentStyle = makeStyles({
  box: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  nothing: {
    textAlign: 'center',
    flexGrow: 1,
    maxWidth: 'calc(500px - 20px)',
    margin: '12px 0',
    padding: '10px 5px 5px',
    borderRadius: '10px',
    color: CssThemeColor.lighterBlue,
    boxShadow: `0 0 5px 4px ${CssThemeColor.greyBlue}`,
    backgroundColor: CssThemeColor.greyBlue,
  },
  message: {
    padding: '5px 15px 20px',
  },
});
