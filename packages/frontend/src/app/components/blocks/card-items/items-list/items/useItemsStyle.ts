import { makeStyles } from '@material-ui/core/styles';


export const useItemsStyle = makeStyles({
  bold: {
    fontWeight: 'bold',
  },
  item: {
    padding: '12px 8px',
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
