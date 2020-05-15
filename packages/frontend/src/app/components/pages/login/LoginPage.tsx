import React, { FC } from 'react';

import { PageMessages } from 'app/messages/PageMessages';

import { InfoCard, InfoCardData } from 'app/components/blocks/card-components/info-card/InfoCard';
import { GoogleLoginButton } from 'app/components/pages/login/buttons/GoogleLoginButton';
import { GoogleRegisterButton } from 'app/components/pages/login/buttons/GoogleRegisterButton';

import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { getDescription } from 'app/components/blocks/card-layout/body/description/getDescription';

export const LoginPage: FC = () => {
  const loginCardData: InfoCardData = {
    header: getCardHeader(PageMessages.login.header),
    description: getDescription(PageMessages.login.subHeader),
    buttons: [
      <GoogleLoginButton />,
    ],
  };
  const registerCardData: InfoCardData = {
    header: getCardHeader(PageMessages.register.header),
    description: getDescription(PageMessages.register.subHeader),
    buttons: [
      <GoogleRegisterButton />,
    ],
  };

  return (
    <>
      <InfoCard data={loginCardData} />
      <InfoCard data={registerCardData} />
    </>
  );
};
