import { makeStyles } from '@material-ui/core/styles';


export const useCardStyle = makeStyles({
  container: {
    width: '100%',
    display: 'flex',
  },
  paper: {
    width: '100%',
    margin: '10px 0',
  },
  gridContainer: {
    padding: '10px 20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  inside: {
    textAlign: 'left',
    padding: '10px 15px',
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    '& > *': {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between',
    },
  },
  left: {
    flexGrow: 2,
  },
  right: {
    textAlign: 'right',
    '& *': {
      justifyContent: 'flex-end',
    },
  },
  bottom: {
    paddingTop: '10px',
  },
});
