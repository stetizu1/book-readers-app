import React, { FC } from 'react';
import { connect } from 'react-redux';

import { useRootStyle } from './RootStyle';

import { AppState } from '../../modules/rootReducer';
import { loginSelector } from '../../modules/login/loginSelector';

import { Header } from '../header/Header';
import { Menu } from '../menu/Menu';
import { Footer } from '../footer/Footer';

import { RouteHandler } from '../RouteHandler';
import { LoginPage } from '../pages/login/LoginPage';


interface StateProps {
  isUserLoggedIn: boolean;
}

type Props = StateProps;

const BaseRoot: FC<Props> = (props) => {
  const classes = useRootStyle();
  return (
    <div className={classes.page}>
      <Header />
      <div className={classes.body}>
        {props.isUserLoggedIn ? (
          <>
            <Menu />
            <RouteHandler />
          </>
        ) : <LoginPage />}
      </div>
      <Footer />
    </div>
  );
};

export const Root = connect(
  (state: AppState): StateProps => ({
    isUserLoggedIn: loginSelector.isUserLoggedIn(state),
  }),
)(BaseRoot);
