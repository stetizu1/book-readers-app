import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { AccountBoxSharp } from '@material-ui/icons';

import { User, UserUpdate } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { convertUserToUserUpdate } from 'book-app-shared/helpers/convert-to-update/user';

import { PageMessages } from 'app/messages/PageMessages';

import { AppState } from 'app/types/AppState';

import { getUpdateValue } from 'app/helpers/updateValue';

import { userSelector } from 'app/modules/user/userSelector';
import { userAction } from 'app/modules/user/userAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { UnknownError } from 'app/components/blocks/errors/UnknownError';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getToggleFormItem } from 'app/components/blocks/card-items/items-form/toggle/getToggleFormItem';

import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { isEmptyObject } from 'book-app-shared/helpers/validators';


interface StateProps {
  user: User | undefined;
}

interface DispatchProps {
  updateUser: typeof userAction.startUpdateUser;
}

type Props = StateProps & DispatchProps;

const messages = PageMessages.profile;

const BaseEditProfilePage: FC<Props> = (props) => {
  const { user, updateUser } = props;
  const [userUpdate, setUserUpdate] = useState<UserUpdate>({});

  if (isUndefined(user)) {
    return <UnknownError />;
  }

  if (isEmptyObject(userUpdate)) {
    setUserUpdate(convertUserToUserUpdate(user));
  }

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
        tooltip: messages.publicProfileTooltip,
      }),
      getTextFormItem({
        label: messages.labels.description,
        value: userUpdate.description,
        multiline: true,
        required: false,
        updateValueFunction: getUpdateValue(userUpdate, setUserUpdate, 'description'),
      }),
    ],
    onSubmit: () => {
      updateUser(user.id, userUpdate);
    },
    isGoingBackOnSubmit: true,
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
)(withLoading(
  BaseEditProfilePage,
  userSelector.getCurrentUserStatus,
));
