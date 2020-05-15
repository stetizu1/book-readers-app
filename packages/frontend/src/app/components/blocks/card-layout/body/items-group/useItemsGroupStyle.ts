import { makeStyles } from '@material-ui/core/styles';
import { PositionType } from 'app/constants/style/types/PositionType';

export const useItemsGroupStyle = makeStyles({
  [PositionType.topLeft]: {
    paddingBottom: '10px',
  },
  [PositionType.topRight]: {
    paddingBottom: '10px',
    textAlign: 'right',
  },
  [PositionType.bottomLeft]: {
    paddingTop: '10px',
  },
  [PositionType.bottomRight]: {
    paddingTop: '10px',
    textAlign: 'right',
  },

});
