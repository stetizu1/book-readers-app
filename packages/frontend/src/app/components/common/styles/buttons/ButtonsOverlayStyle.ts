import { makeStyles } from '@material-ui/core/styles';


export const useButtonsOverlayStyle = makeStyles({
  multiple: {
    display: 'flex',
    alignItems: 'flex-end',
    margin: '20px',
    '& > *': {
      margin: '0 10px',
    },
  },
  opposite: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '50px',
    '& > *': {
      margin: '10px 30px',
    },
  },
});
