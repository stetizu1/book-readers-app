import { makeStyles } from '@material-ui/core/styles';
import { CssThemeColor } from '../../../constants/Css';


export const useCardStyle = makeStyles({
  paper: {
    maxWidth: 500,
    minWidth: '50%',
    alignSelf: 'center',
    backgroundColor: CssThemeColor.greyYellow,
    margin: '10px 0',
    padding: '10px 20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  image: {
    width: '130px',
    fontSize: '130px',
  },
  item: {
    padding: '8px 5px',
  },
  inside: {
    textAlign: 'left',
    padding: '10px 15px',
  },
  header: {
    fontWeight: 'bold',
    paddingBottom: '5px',
    fontSize: 'large',
  },
  subHeader: {
    paddingBottom: '0',
    fontWeight: 'bold',
    fontSize: 'small',
  },
});
