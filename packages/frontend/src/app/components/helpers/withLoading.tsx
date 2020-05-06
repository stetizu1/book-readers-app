import React, { ComponentType, FC, ReactElement } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Selector } from 'reselect';
import { connect } from 'react-redux';

import { isStatus, PlainStatus } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';


interface StatusProps {
  status: PlainStatus;
}

const withLoadingSimple = <TProps extends {}>(WrappedComponent: ComponentType<TProps>): ComponentType<TProps & StatusProps> => (
  (props): ReactElement => {
    if (isStatus.loading(props.status)) return <CircularProgress />;
    return <WrappedComponent {...props} />;
  });

export const withLoading = <TProps extends {}>(
  WrappedComponent: ComponentType<TProps>,
  selector: Selector<AppState, PlainStatus>,
): ComponentType<TProps> => (
    connect<StatusProps, {}, {}, AppState>(
      (state) => ({
        status: selector(state),
      }),
    )(withLoadingSimple(WrappedComponent) as FC)
  );
