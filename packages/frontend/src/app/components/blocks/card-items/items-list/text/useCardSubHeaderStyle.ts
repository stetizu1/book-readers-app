import { makeStyles } from '@material-ui/core/styles';
import { CssThemeTransparentColor } from '../../../../../constants/style/Colors';


export const useCardSubHeaderStyle = makeStyles({
  text: {
    fontWeight: 'bold',
    paddingTop: '3px',
    paddingBottom: '3px',
    fontSize: '1em',
  },
  subLine: {
    width: '100%',
    margin: 0,
    borderColor: CssThemeTransparentColor.lightBlue,
  },
});
