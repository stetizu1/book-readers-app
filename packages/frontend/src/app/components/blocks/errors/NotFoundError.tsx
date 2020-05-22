import React, { FC } from 'react';
import { NotInterested } from '@material-ui/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { PageMessages } from 'app/messages/PageMessages';

import { InfoCard } from '../card-components/info-card/InfoCard';
import { getCardHeader } from '../card-layout/header/getCardHeader';
import { getDescription } from '../card-layout/body/description/getDescription';
import { getButton } from '../card-items/button/getButton';
import { ButtonType } from '../../../constants/style/types/ButtonType';
import { ButtonMessage } from '../../../messages/ButtonMessage';


const BaseNotFoundError: FC<RouteComponentProps> = ({ history }) => (
  <InfoCard data={{
    header: getCardHeader(PageMessages.notFound.header, NotInterested),
    description: getDescription(PageMessages.notFound.description),
    buttons: [
      getButton({
        buttonType: ButtonType.cancel,
        label: ButtonMessage.Back,
        onClick: () => history.goBack(),
      }),
    ],
  }}
  />
);

export const NotFoundError = withRouter(BaseNotFoundError);
