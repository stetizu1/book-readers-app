import React, { FC } from 'react';
import { connect } from 'react-redux';
import { AppState } from '../modules/rootReducer';
import { loginSelector } from '../modules/login/loginSelector';
import { RouteHandler } from './RouteHandler';
import { LoginPage } from './pages/login/LoginPage';
import { Header } from './header/Header';

interface StateProps {
  isUserLoggedIn: boolean;
}

type Props = StateProps;

const BaseRoot: FC<Props> = (props) => (
  <>
    <Header />
    {props.isUserLoggedIn ? <RouteHandler /> : <LoginPage />}
    <div>Footer</div>
  </>
);

export const Root = connect(
  (state: AppState): StateProps => ({
    isUserLoggedIn: loginSelector.isUserLoggedIn(state),
  }),
)(BaseRoot);
