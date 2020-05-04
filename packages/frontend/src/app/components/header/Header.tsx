import React, { FC } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import { AccountCircle, MenuBook } from '@material-ui/icons';
import { Link } from 'react-router-dom';

import { useHeaderStyle } from './HeaderStyle';

import { ProfilePath } from '../../constants/Path';
import { Name } from '../../messages/Name';
import { ButtonMessage } from '../../messages/ButtonMessage';
import { loginAction } from '../../modules/login/loginAction';
import { loginSelector } from '../../modules/login/loginSelector';
import { userSelector } from '../../modules/user/userSelector';
import { AppState } from '../../modules/rootReducer';

import { useButtonStyle } from '../common/ButtonsStyle';


interface StateProps {
  userEmail: string | undefined;
  isUserLoggedIn: boolean;
}

interface DispatchProps {
  logout: typeof loginAction.logout;
}

type Props = StateProps & DispatchProps;

const BaseHeader: FC<Props> = (props) => {
  const classes = useHeaderStyle();
  const buttonClasses = useButtonStyle();
  const onClick = (): void => {
    props.logout();
  };

  const ProfileInfo = (props.isUserLoggedIn) ? (
    <>
      <div>
        <div>{props.userEmail}</div>
        <Button
          variant="text"
          className={buttonClasses.delete}
          onClick={onClick}
        >
          {ButtonMessage.LogoutText}
        </Button>
      </div>
      <Link to={ProfilePath.profile}><AccountCircle className={classes.headerIcon} /></Link>
    </>
  ) : null;
  return (
    <header className={classes.header}>
      <div className={classes.headerLogo}>
        <MenuBook className={classes.headerIcon} />
        <h1>{Name.AppName}</h1>
      </div>
      <span className={classes.emptySpace} />
      {ProfileInfo}
    </header>
  );
};

export const Header = connect(
  (state: AppState): StateProps => ({
    isUserLoggedIn: loginSelector.isUserLoggedIn(state),
    userEmail: userSelector.getCurrentUserEmail(state),
  }),
  (dispatch): DispatchProps => (
    bindActionCreators({
      logout: loginAction.logout,
    }, dispatch)
  ),
)(BaseHeader);
