import React, { FC } from 'react';
import { connect } from 'react-redux';

import { AppState } from 'app/types/AppState';

import { loginSelector } from 'app/modules/login/loginSelector';

import { Header } from 'app/components/header/Header';
import { Footer } from 'app/components/footer/Footer';
import { Menu } from 'app/components/menu/Menu';
import { RouteHandler } from 'app/components/RouteHandler';

import { useRootStyle } from './useRootStyle';


interface StateProps {
  isUserLoggedIn: boolean;
}

type Props = StateProps;

const BaseRoot: FC<Props> = ({ isUserLoggedIn }) => {
  const classes = useRootStyle();
  return (
    <div className={classes.page}>
      <Header />
      <div className={classes.body}>
        {isUserLoggedIn && (
          <Menu />
        )}
        <RouteHandler />
      </div>
      <Footer />
    </div>
  );
};

export const Root = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    isUserLoggedIn: loginSelector.isUserLoggedIn(state),
  }),
)(BaseRoot);
