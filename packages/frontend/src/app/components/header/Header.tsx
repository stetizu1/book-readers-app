import React, { FC } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loginAction } from '../../modules/login/loginAction';
import { ButtonMessage } from '../../messages/ButtonMessage';
import { AppState } from '../../modules/rootReducer';
import { loginSelector } from '../../modules/login/loginSelector';
import { userSelector } from '../../modules/user/userSelector';

interface StateProps {
  userEmail: string | undefined;
  isUserLoggedIn: boolean;
}

interface DispatchProps {
  logout: typeof loginAction.logout;
}

type Props = StateProps & DispatchProps;

const BaseHeader: FC<Props> = (props) => {
  const onClick = (): void => {
    props.logout();
  };

  if (!props.isUserLoggedIn) return null;
  return (
    <>
      {props.userEmail}
      <button
        type="button"
        onClick={onClick}
      >
        {ButtonMessage.LogoutText}
      </button>
    </>
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
