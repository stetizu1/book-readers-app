import { makeStyles } from '@material-ui/core/styles';
import { CssThemeColor } from 'app/constants/style/Colors';


export const useCardHeaderStyle = makeStyles({
  outside: {
    display: 'flex',
    width: '100%',
  },
  header: {
    flexGrow: 1,
    fontWeight: 'bold',
    padding: '10px 16px',
    fontSize: '1.6em',
    display: 'flex',
    flexDirection: 'column',
  },
  innerHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  image: {
    paddingBottom: '4px',
  },
  text: {
    zIndex: 10,
  },
  headerLine: {
    width: '100%',
    margin: '-4px 0 0',
    borderColor: CssThemeColor.lightBlue,
  },
});
