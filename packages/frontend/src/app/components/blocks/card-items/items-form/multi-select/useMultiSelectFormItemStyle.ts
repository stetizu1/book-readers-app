import { makeStyles } from '@material-ui/core/styles';
import { CssButtonColors, CssFontColor, CssThemeColor } from 'app/constants/style/Colors';

export const useMultiSelectFormItemStyle = makeStyles({
  multiSelectContainer: {
    width: '100%',
  },
  multiSelect: {
    border: `1px solid ${CssThemeColor.lightBlue}`,
    borderRadius: '5px',
    padding: '5px',
    '&:hover': {
      borderColor: CssThemeColor.lighterBlue,
    },
    '&.Mui-focused': {
      borderColor: CssThemeColor.lighterBlue,
    },
    '&:before': {
      borderBottom: 'none !important',
    },
    '&:after': {
      borderBottom: 'none !important',
    },
    '& > *': {
      padding: 0,
      display: 'flex',
      flexWrap: 'wrap',
      height: 'auto',
    },
    '& .MuiChip-root': {
      padding: 0,
    },
    color: CssFontColor.lightBlue,
    '& option': {
      color: 'initial',
    },
  },

  checkIcon: {
    marginLeft: '5px',
    fontSize: '15px',
    color: CssButtonColors.save,
  },
});
