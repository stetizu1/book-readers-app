import { makeStyles } from '@material-ui/core/styles';


export const useCardItemStyle = makeStyles({
  bold: {
    fontWeight: 'bold',
  },
  item: {
    padding: '2px 8px',
  },
  itemContainer: {
    marginTop: '4px',
    display: 'flex',
    flexWrap: 'wrap',
  },
  subHeader: {
    fontWeight: 'bold',
    fontSize: '0.9em',
    paddingTop: '3px',
  },
});
