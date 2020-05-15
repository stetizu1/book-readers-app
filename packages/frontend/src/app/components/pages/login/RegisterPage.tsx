import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AccountBoxSharp } from '@material-ui/icons';

import { UserCreate } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { getUserCreateDefault } from 'app/helpers/form/create-default/user';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';

import { userSelector } from 'app/modules/user/userSelector';
import { loginAction } from 'app/modules/login/loginAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getToggleFormItem } from 'app/components/blocks/card-items/items-form/toggle/getToggleFormItem';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { loginSelector } from 'app/modules/login/loginSelector';
import { MenuPath } from 'app/constants/Path';
import { GoogleData } from 'app/constants/GoogleData';
import { getUpdateValue } from 'app/helpers/updateValue';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';

import { ButtonType } from 'app/constants/style/types/ButtonType';


interface StateProps {
  googleData: GoogleData | undefined;
}

interface DispatchProps {
  startRegistration: typeof loginAction.startRegistration;
}

type Props = RouteComponentProps & StateProps & DispatchProps;

const BaseRegisterPage: FC<Props> = (props) => {
  const { googleData } = props;
  const [userCreate, setUserCreate] = useState<UserCreate>(getUserCreateDefault(googleData?.email, googleData?.token));

  if (isUndefined(googleData)) props.history.push(MenuPath.home);

  const cardData: EditCardData = {
    header: getCardHeader(PageMessages.profile.header, AccountBoxSharp),
    items: [
      getTextFormItem({
        label: PageMessages.profile.emailHeader,
        value: userCreate.email,
        readOnly: true,
      }),
      getTextFormItem({
        label: PageMessages.profile.nameHeader,
        value: userCreate.name,
        required: false,
        updateValueFunction: getUpdateValue(userCreate, setUserCreate, 'name'),

      }),
      getToggleFormItem({
        label: PageMessages.profile.publicProfileHeader,
        value: userCreate.publicProfile,
        updateValueFunction: getUpdateValue(userCreate, setUserCreate, 'publicProfile'),
      }),
      getTextFormItem({
        label: PageMessages.profile.descriptionHeader,
        value: userCreate.description,
        required: false,
        updateValueFunction: getUpdateValue(userCreate, setUserCreate, 'description'),
      }),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.save,
        label: ButtonMessage.RegisterText,
        onClick: (): void => {
          props.startRegistration(userCreate);
        },
      }),
    ],
  };

  return (
    <FormCard data={cardData} />
  );
};

export const RegisterPage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    googleData: loginSelector.getGoogleData(state),
  }),
  {
    startRegistration: loginAction.startRegistration,
  },
)(withRouter(withLoading(BaseRegisterPage, userSelector.getCurrentUserStatus)));
