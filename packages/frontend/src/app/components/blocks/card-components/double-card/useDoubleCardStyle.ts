import { makeStyles } from '@material-ui/core/styles';

import { CssFontColor, CssThemeColor } from 'app/constants/style/Colors';


const content = {
  padding: '0 10px',
  width: 'calc(50% - 20px)',
  margin: '10px',
  borderRadius: '10px',
  backgroundColor: CssThemeColor.blue,
  boxShadow: `0 0 2px 2px ${CssThemeColor.blue}`,
  '& > div': {
    '& > span': {
      padding: '10px 5px',
    },
  },
};

export const useDoubleCardStyle = makeStyles({
  paper: {
    width: '100%',
    margin: '10px 0',
    maxWidth: '500px',
    backgroundColor: CssThemeColor.greyBlue,
    color: CssFontColor.lightBlue,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  sideBySide: {
    display: 'flex',
    flexDirection: 'row',
  },
  rightContent: {
    ...content,
    marginRight: '20px',
  },
  leftContent: {
    ...content,
    marginLeft: '20px',
  },
});
