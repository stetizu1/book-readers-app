import React, { ComponentType, FC, ReactElement } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Selector } from 'reselect';
import { connect } from 'react-redux';

import { isStatus, PlainStatus } from 'app/constants/Status';
import { AppState } from 'app/types/AppState';


interface StatusProps {
  statuses: PlainStatus[];
}

const withLoadingSimple = <TProps extends {}>(WrappedComponent: ComponentType<TProps>): ComponentType<TProps & StatusProps> => (
  (props): ReactElement => {
    const { statuses } = props;
    if (statuses.some((status) => isStatus.loading(status))) return <CircularProgress />;
    return <WrappedComponent {...props} />;
  });

export const withLoading = <TProps extends {}>(WrappedComponent: ComponentType<TProps>, ...selectors: Selector<AppState, PlainStatus>[]): ComponentType<TProps> => (
  connect<StatusProps, {}, {}, AppState>(
    (state) => ({
      statuses: selectors.map((selector) => selector(state)),
    }),
  )(withLoadingSimple(WrappedComponent) as FC)
);
