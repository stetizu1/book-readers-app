import React, { FC } from 'react';

import { PageMessages } from 'app/messages/PageMessages';

import { CardComponent, CardData } from 'app/components/blocks/CardComponent';
import { GoogleLoginButton } from 'app/components/pages/login/buttons/GoogleLoginButton';
import { GoogleRegisterButton } from 'app/components/pages/login/buttons/GoogleRegisterButton';

import { useContainerStyle } from 'app/components/blocks/styles/ContainerStyle';
import { getHeader } from 'app/components/blocks/card-components/header/getHeader';
import { getDescription } from 'app/components/blocks/card-components/description/getDescription';


export const LoginPage: FC = () => {
  const classes = useContainerStyle();

  const loginCardData: CardData = {
    header: getHeader(PageMessages.login.header),
    description: getDescription(PageMessages.login.subHeader),
    buttons: [
      <GoogleLoginButton />,
    ],
  };
  const registerCardData: CardData = {
    header: getHeader(PageMessages.register.header),
    description: getDescription(PageMessages.register.subHeader),
    buttons: [
      <GoogleRegisterButton />,
    ],
  };

  return (
    <>
      <div className={classes.container}>
        <CardComponent data={loginCardData} />
      </div>
      <div className={classes.container}>
        <CardComponent data={registerCardData} />
      </div>
    </>
  );
};
