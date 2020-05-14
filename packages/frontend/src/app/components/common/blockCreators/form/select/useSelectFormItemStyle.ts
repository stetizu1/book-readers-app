import { makeStyles } from '@material-ui/core/styles';
import { CssFontColor } from 'app/constants/style/Colors';


const selectFormItemStyle = {
  select: {
    width: '210px',
    color: CssFontColor.lightBlue,
    '& option': {
      color: 'initial',
    },
  },
};

export const useSelectFormItemStyle = makeStyles(selectFormItemStyle);
