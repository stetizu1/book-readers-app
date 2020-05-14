import { makeStyles } from '@material-ui/core/styles';
import { CssFontColor } from 'app/constants/style/Colors';

export const useSelectFormItemStyle = makeStyles({
  selectContainer: {
    width: '100%',
  },
  select: {
    color: CssFontColor.lightBlue,
    '& option': {
      color: 'initial',
    },
  },
});
