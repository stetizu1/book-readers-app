import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AccountBoxSharp } from '@material-ui/icons';

import { UserCreate } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { getUserCreateDefault } from 'app/constants/create-default/user';
import { ButtonVariant } from 'app/constants/style/ButtonVariant';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';

import { userSelector } from 'app/modules/user/userSelector';
import { loginAction } from 'app/modules/login/loginAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { EditCardComponent, EditCardData } from 'app/components/blocks/EditCardComponent';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getToggleFormItem } from 'app/components/blocks/card-items/items-form/toggle/getToggleFormItem';
import { getButton } from 'app/components/blocks/card-items/button/getButton';

import { useButtonStyle } from 'app/components/blocks/card-items/button/ButtonsStyle';
import { useContainerStyle } from 'app/components/blocks/styles/ContainerStyle';
import { loginSelector } from 'app/modules/login/loginSelector';
import { MenuPath } from 'app/constants/Path';
import { GoogleData } from 'app/constants/GoogleData';
import { getUpdateValue } from 'app/helpers/updateValue';
import { getImage } from 'app/components/blocks/card-items/getImage';
import { getHeader } from 'app/components/blocks/card-items/getHeader';


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

  const buttonClasses = useButtonStyle();
  const classes = useContainerStyle();

  if (isUndefined(googleData)) props.history.push(MenuPath.home);

  const cardData: EditCardData = {
    header: getHeader(PageMessages.profile.header),
    image: getImage(AccountBoxSharp),
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
        variant: ButtonVariant.contained,
        classType: buttonClasses.save,
        label: ButtonMessage.Confirm,
        onClick: (): void => {
          props.startRegistration(userCreate);
        },
      }),
    ],
  };

  return (
    <>
      <div className={classes.container}>
        <EditCardComponent data={cardData} />
      </div>
    </>
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
