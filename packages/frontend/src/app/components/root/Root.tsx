import React, { FC } from 'react';
import { connect } from 'react-redux';

import { AppState } from 'app/types/AppState';

import { loginSelector } from 'app/modules/login/loginSelector';

import { Header } from 'app/components/header/Header';
import { Footer } from 'app/components/footer/Footer';
import { Menu } from 'app/components/menu/Menu';
import { RouteHandler } from 'app/components/RouteHandler';

import { useRootStyle } from './RootStyle';


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
        {props.isUserLoggedIn && (
          <Menu />
        )}
        <RouteHandler />
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
