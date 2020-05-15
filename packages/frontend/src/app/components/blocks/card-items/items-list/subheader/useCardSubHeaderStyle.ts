import { makeStyles } from '@material-ui/core/styles';
import { CssThemeTransparentColor } from 'app/constants/style/Colors';


export const useCardSubHeaderStyle = makeStyles({
  subheader: {
    fontWeight: 'bold',
    paddingTop: '10px',
    paddingBottom: '3px',
    fontSize: '1em',
  },
  subLine: {
    width: '100%',
    margin: 0,
    borderColor: CssThemeTransparentColor.lightBlue,
  },
});
