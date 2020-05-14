import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { AccountCircle, MenuBook } from '@material-ui/icons';

import { AppState } from 'app/types/AppState';
import { ProfilePath } from 'app/constants/Path';
import { ButtonType } from 'app/constants/style/ButtonType';
import { OtherMessage } from 'app/messages/OtherMessage';

import { loginAction } from 'app/modules/login/loginAction';
import { loginSelector } from 'app/modules/login/loginSelector';
import { userSelector } from 'app/modules/user/userSelector';

import { getButton } from '../blocks/card-items/button/getButton';
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
  const onClick = (): void => {
    props.logout();
  };

  const ProfileInfo = (props.isUserLoggedIn) ? (
    <>
      <div>
        <div>{props.userEmail}</div>
        {getButton({
          buttonType: ButtonType.logout,
          onClick,
        })}
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

export const Header = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    isUserLoggedIn: loginSelector.isUserLoggedIn(state),
    userEmail: userSelector.getCurrentUserEmail(state),
  }),
  {
    logout: loginAction.logout,
  },
)(BaseHeader);
