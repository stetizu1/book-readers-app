import { makeStyles } from '@material-ui/core/styles';
import { CssFontColor } from 'app/constants/style/Colors';


export const useTextFormItemStyle = makeStyles({
  item: {
    width: '100%',
    '& textarea': {
      color: `${CssFontColor.lightBlue} !important`,
    },
  },
  tooltip: {
    fontSize: '15px',
    lineHeight: '1.3em',
  },
});
