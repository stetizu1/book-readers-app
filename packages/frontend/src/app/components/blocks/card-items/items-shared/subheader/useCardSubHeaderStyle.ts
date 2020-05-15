import { makeStyles } from '@material-ui/core/styles';
import { CssThemeTransparentColor } from 'app/constants/style/Colors';


export const useCardSubHeaderStyle = makeStyles({
  subheader: {
    fontWeight: 'bold',
    paddingTop: '15px',
    paddingBottom: '10px',
    fontSize: '1.1em',
  },
  subLine: {
    width: '100%',
    margin: 0,
    borderColor: CssThemeTransparentColor.lightBlue,
  },
});
