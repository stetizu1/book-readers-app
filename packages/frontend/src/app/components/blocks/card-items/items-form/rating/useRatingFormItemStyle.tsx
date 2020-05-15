import { makeStyles } from '@material-ui/core/styles';
import { CssThemeColor } from '../../../../../constants/style/Colors';

export const useRatingFormItemStyle = makeStyles({
  ratingContainer: {
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${CssThemeColor.lightBlue}`,
    borderRadius: '5px',
    alignItems: 'flex-start',
  },
  ratingLabel: {
    padding: '1px 5px',
    fontSize: '12px',
    margin: '-10px 8px',
    background: CssThemeColor.greyBlue,
  },
  rating: {
    padding: '12px 0 5px',
    fontSize: '38px',
    alignSelf: 'center',
  },
});
