import React, { FC } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { AccountCircle, MenuBook } from '@material-ui/icons';

import { AppState } from 'app/types/AppState';
import { ProfilePath } from 'app/constants/Path';
import { OtherMessage } from 'app/messages/OtherMessage';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { loginAction } from 'app/modules/login/loginAction';
import { loginSelector } from 'app/modules/login/loginSelector';
import { userSelector } from 'app/modules/user/userSelector';

import { useButtonStyle } from 'app/components/common/styles/buttons/ButtonsStyle';
import { useHeaderStyle } from './HeaderStyle';


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
          className={buttonClasses.logout}
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
        <h1>{OtherMessage.appName}</h1>
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
