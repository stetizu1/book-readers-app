import React, { ComponentType, FC, ReactElement } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Selector } from 'reselect';
import { connect } from 'react-redux';

import { isStatus, PlainStatus } from '../../constants/Status';
import { AppState } from '../../modules/rootReducer';


interface StatusProps {
  status: PlainStatus;
}

const withLoadingSimple = <TProps extends {}>(WrappedComponent: ComponentType<TProps>): ComponentType<TProps & StatusProps> => (
  (props): ReactElement => {
    if (isStatus.loading(props.status)) return <CircularProgress />;
    return <WrappedComponent {...props} />;
  });

export const withLoading = <TProps extends {}>(
  selector: Selector<AppState, PlainStatus>,
  WrappedComponent: ComponentType<TProps>,
): ComponentType<TProps> => (
    connect(
      (state: AppState): StatusProps => ({
        status: selector(state),
      }),
    )(withLoadingSimple(WrappedComponent) as FC)
  );
