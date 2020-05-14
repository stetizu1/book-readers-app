import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AccountBoxSharp } from '@material-ui/icons';

import { User, UserUpdate } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { convertUserToUserUpdate } from 'book-app-shared/helpers/convert-to-update/user';

import { ButtonVariant } from 'app/constants/style/ButtonVariant';
import { ProfilePath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';

import { getUpdateValue } from 'app/helpers/updateValue';

import { userSelector } from 'app/modules/user/userSelector';
import { userAction } from 'app/modules/user/userAction';

import { withLoading } from 'app/components/wrappers/withLoading';
import { EditCardComponent, EditCardData } from 'app/components/blocks/EditCardComponent';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getToggleFormItem } from 'app/components/blocks/card-items/items-form/toggle/getToggleFormItem';

import { useButtonStyle } from 'app/components/blocks/card-items/button/ButtonsStyle';
import { useContainerStyle } from 'app/components/blocks/styles/ContainerStyle';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getHeader } from 'app/components/blocks/card-items/getHeader';
import { getImage } from 'app/components/blocks/card-items/getImage';


interface StateProps {
  user: User | undefined;
}

interface DispatchProps {
  updateUser: typeof userAction.startUpdateUser;
}

type Props = RouteComponentProps & StateProps & DispatchProps;

const BaseEditProfilePage: FC<Props> = (props) => {
  const { user, updateUser } = props;
  const defaultUserUpdate = isUndefined(user) ? {} : convertUserToUserUpdate(user);
  const [userUpdate, setUserUpdate] = useState<UserUpdate>(defaultUserUpdate);

  const buttonClasses = useButtonStyle();
  const classes = useContainerStyle();

  if (isUndefined(user)) return null;

  const cardData: EditCardData = {
    header: getHeader(PageMessages.profile.header),
    image: getImage(AccountBoxSharp),
    items: [
      getTextFormItem({
        label: PageMessages.profile.emailHeader,
        value: user.email,
        readOnly: true,
      }),
      getTextFormItem({
        label: PageMessages.profile.nameHeader,
        value: userUpdate.name,
        required: false,
        updateValueFunction: getUpdateValue(userUpdate, setUserUpdate, 'name'),
      }),
      getToggleFormItem({
        label: PageMessages.profile.publicProfileHeader,
        value: userUpdate.publicProfile,
        updateValueFunction: getUpdateValue(userUpdate, setUserUpdate, 'publicProfile'),
      }),
      getTextFormItem({
        label: PageMessages.profile.descriptionHeader,
        value: userUpdate.description,
        required: false,
        updateValueFunction: getUpdateValue(userUpdate, setUserUpdate, 'description'),
      }),
    ],
    buttons: [
      getButton({
        variant: ButtonVariant.contained,
        classType: buttonClasses.save,
        label: ButtonMessage.Confirm,
        onClick: (): void => {
          updateUser(user.id, userUpdate);
          props.history.push(ProfilePath.profile);
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

export const EditProfilePage = connect<StateProps, DispatchProps, {}, AppState>(
  (state) => ({
    user: userSelector.getCurrentUser(state),
  }),
  {
    updateUser: userAction.startUpdateUser,
  },
)(withRouter(withLoading(BaseEditProfilePage, userSelector.getCurrentUserStatus)));
