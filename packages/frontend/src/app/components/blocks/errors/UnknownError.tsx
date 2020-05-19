import React, { FC } from 'react';
import { WarningSharp } from '@material-ui/icons';

import { PageMessages } from 'app/messages/PageMessages';

import { InfoCard } from '../card-components/info-card/InfoCard';
import { getCardHeader } from '../card-layout/header/getCardHeader';
import { getDescription } from '../card-layout/body/description/getDescription';


export const UnknownError: FC = () => (
  <InfoCard data={{
    header: getCardHeader(PageMessages.unknownError.header, WarningSharp),
    description: getDescription(PageMessages.unknownError.description),
  }}
  />
);
