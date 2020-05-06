import React, { FC } from 'react';

import { PageMessages } from 'app/messages/PageMessages';

import { CardComponent, CardData } from 'app/components/common/CardComponent';
import { GoogleLoginButton } from 'app/components/pages/login/buttons/GoogleLoginButton';
import { GoogleRegisterButton } from 'app/components/pages/login/buttons/GoogleRegisterButton';

import { useWideCardStyle } from 'app/components/common/styles/WideCardStyle';


export const LoginPage: FC = () => {
  const classes = useWideCardStyle();

  const loginCardData: CardData = {
    header: PageMessages.login.header,
    subHeader: PageMessages.login.subHeader,
    buttons: [
      <GoogleLoginButton />,
    ],
  };
  const registerCardData: CardData = {
    header: PageMessages.register.header,
    subHeader: PageMessages.register.subHeader,
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
