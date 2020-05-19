import { makeStyles } from '@material-ui/core/styles';
import { CssThemeTransparentColor } from 'app/constants/style/Colors';


export const useCardsStyle = makeStyles({
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
    padding: '15px 10px',
    borderRadius: '10px',
    boxShadow: `0 0 5px 4px ${CssThemeTransparentColor.greyYellow}`,
    backgroundColor: CssThemeTransparentColor.greyYellow,
  },
});
