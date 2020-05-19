import React, { FC } from 'react';
import { NotInterested } from '@material-ui/icons';

import { PageMessages } from 'app/messages/PageMessages';

import { InfoCard } from '../card-components/info-card/InfoCard';
import { getCardHeader } from '../card-layout/header/getCardHeader';
import { getDescription } from '../card-layout/body/description/getDescription';


export const NotFoundError: FC = () => (
  <InfoCard data={{
    header: getCardHeader(PageMessages.notFound.header, NotInterested),
    description: getDescription(PageMessages.notFound.description),
  }}
  />
);
