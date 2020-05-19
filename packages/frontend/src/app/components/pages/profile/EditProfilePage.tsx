import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AccountBoxSharp } from '@material-ui/icons';

import { User, UserUpdate } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { convertUserToUserUpdate } from 'book-app-shared/helpers/convert-to-update/user';

import { ProfilePath } from 'app/constants/Path';
import { ButtonType } from 'app/constants/style/types/ButtonType';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';

import { getUpdateValue } from 'app/helpers/updateValue';

import { userSelector } from 'app/modules/user/userSelector';
import { userAction } from 'app/modules/user/userAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getToggleFormItem } from 'app/components/blocks/card-items/items-form/toggle/getToggleFormItem';

import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';


interface StateProps {
  user: User | undefined;
}

interface DispatchProps {
  updateUser: typeof userAction.startUpdateUser;
}

type Props = RouteComponentProps & StateProps & DispatchProps;

const messages = PageMessages.profile;

const BaseEditProfilePage: FC<Props> = (props) => {
  const { user, updateUser } = props;
  const defaultUserUpdate = isUndefined(user) ? {} : convertUserToUserUpdate(user);
  const [userUpdate, setUserUpdate] = useState<UserUpdate>(defaultUserUpdate);

  if (isUndefined(user)) return null;

  const cardData: EditCardData = {
    header: getCardHeader(messages.editHeader, AccountBoxSharp),
    items: [
      getTextFormItem({
        label: messages.labels.email,
        value: user.email,
        readOnly: true,
      }),
      getTextFormItem({
        label: messages.labels.name,
        value: userUpdate.name,
        required: false,
        updateValueFunction: getUpdateValue(userUpdate, setUserUpdate, 'name'),
      }),
      getToggleFormItem({
        label: messages.labels.publicProfile,
        value: userUpdate.publicProfile,
        updateValueFunction: getUpdateValue(userUpdate, setUserUpdate, 'publicProfile'),
      }),
      getTextFormItem({
        label: messages.labels.description,
        value: userUpdate.description,
        required: false,
        updateValueFunction: getUpdateValue(userUpdate, setUserUpdate, 'description'),
      }),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.save,
        onClick: (): void => {
          updateUser(user.id, userUpdate);
          props.history.push(ProfilePath.profile);
        },
      }),
    ],
  };

  return (
    <FormCard data={cardData} />
  );
};

export const EditProfilePage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    user: userSelector.getCurrentUser(state),
  }),
  {
    updateUser: userAction.startUpdateUser,
  },
)(withRouter(withLoading(
  BaseEditProfilePage,
  userSelector.getCurrentUserStatus,
)));
