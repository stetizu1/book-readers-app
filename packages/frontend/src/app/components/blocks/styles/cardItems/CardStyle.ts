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
    '& > *': {
      flexWrap: 'nowrap',
    },
  },
  inside: {
    textAlign: 'left',
    padding: '0 15px',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    width: '100%',
    justifyContent: 'space-between',
    '& > *': {
      display: 'flex',
      flexDirection: 'row',
      height: '100%',
      '& > *': {
        display: 'flex',
        flexDirection: 'column',
      },
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
  top: {
    paddingBottom: '10px',
  },
  bottom: {
    paddingTop: '10px',
  },
});
