import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AccountBoxSharp } from '@material-ui/icons';
import { CircularProgress } from '@material-ui/core';

import { UserCreate } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { getUserCreateDefault } from 'app/helpers/form/create-default/user';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';

import { loginAction } from 'app/modules/login/loginAction';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getToggleFormItem } from 'app/components/blocks/card-items/items-form/toggle/getToggleFormItem';

import { loginSelector } from 'app/modules/login/loginSelector';
import { MenuPath } from 'app/constants/Path';
import { GoogleData } from 'app/constants/GoogleData';
import { getUpdateValue } from 'app/helpers/updateValue';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';


interface StateProps {
  googleData: GoogleData | undefined;
  registrationCheckLoading: boolean;
}

interface DispatchProps {
  startRegistration: typeof loginAction.startRegistration;
}

type Props = RouteComponentProps & StateProps & DispatchProps;

const messages = PageMessages.profile;

const BaseRegisterPage: FC<Props> = (props) => {
  const {
    startRegistration, googleData, registrationCheckLoading,
    history,
  } = props;
  const [userCreate, setUserCreate] = useState<UserCreate>(getUserCreateDefault(googleData?.email, googleData?.token));

  if (isUndefined(googleData)) history.push(MenuPath.home);

  if (registrationCheckLoading) return <CircularProgress />;

  const cardData: EditCardData = {
    header: getCardHeader(messages.addHeader, AccountBoxSharp),
    items: [
      getTextFormItem({
        label: messages.labels.email,
        value: userCreate.email,
        readOnly: true,
      }),
      getTextFormItem({
        label: messages.labels.name,
        value: userCreate.name,
        required: false,
        updateValueFunction: getUpdateValue(userCreate, setUserCreate, 'name'),

      }),
      getToggleFormItem({
        label: messages.labels.publicProfile,
        value: userCreate.publicProfile,
        updateValueFunction: getUpdateValue(userCreate, setUserCreate, 'publicProfile'),
        tooltip: messages.publicProfileTooltip,
      }),
      getTextFormItem({
        label: messages.labels.description,
        value: userCreate.description,
        multiline: true,
        required: false,
        updateValueFunction: getUpdateValue(userCreate, setUserCreate, 'description'),
      }),
    ],
    onSubmit: () => {
      startRegistration(userCreate);
    },
  };

  return (
    <FormCard data={cardData} />
  );
};

export const RegisterPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    googleData: loginSelector.getGoogleData(state),
    registrationCheckLoading: loginSelector.getRegistrationCheckLoading(state),
  }),
  {
    startRegistration: loginAction.startRegistration,
  },
)(withRouter(BaseRegisterPage));
