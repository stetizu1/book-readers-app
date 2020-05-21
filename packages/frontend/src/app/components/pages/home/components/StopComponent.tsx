import React, { FC } from 'react';
import { PanToolTwoTone } from '@material-ui/icons';
import { connect } from 'react-redux';

import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';

import { wishlistSelector } from 'app/modules/wishlist/wishlistSelector';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { IconCard } from 'app/components/blocks/card-components/icon-card/IconCard';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';


interface StateProps {
  stopActive: boolean | undefined;
}

type Props = StateProps;

const messages = PageMessages.home.stop;

export const BaseStopComponent: FC<Props> = ({ stopActive }) => {
  if (isUndefined(stopActive)) {
    return <UnknownError />;
  }
  return (
    <IconCard data={{
      header: getCardHeader(messages.header),
      description: getDescription(messages.description),
      Icon: PanToolTwoTone,
    }}
    />
  );
};

export const StopComponent = connect<StateProps, {}, {}, AppState>(
  (state) => ({
    stopActive: wishlistSelector.getStopActive(state),
  }),
)(withLoading(
  BaseStopComponent,
  wishlistSelector.getWishlistStatus,
));
