import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AccountBoxSharp } from '@material-ui/icons';

import { User, UserUpdate } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';
import { convertUserToUserUpdate } from 'book-app-shared/helpers/convertToUpdate/user';

import { ButtonVariant } from 'app/constants/style/ButtonVariant';
import { ProfilePath } from 'app/constants/Path';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';

import { userSelector } from 'app/modules/user/userSelector';
import { userAction } from 'app/modules/user/userAction';

import { withLoading } from 'app/components/helpers/withLoading';
import { EditCardComponent, EditCardData } from 'app/components/common/EditCardComponent';
import { InputType } from 'app/components/common/getCardElement';

import { useButtonStyle } from 'app/components/common/styles/ButtonsStyle';
import { useProfilePageStyle } from './ProfilePageStyle';


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
  const classes = useProfilePageStyle();

  if (isUndefined(user)) return null;

  const updateState = <T extends keyof UserUpdate>(key: T, value: UserUpdate[T]): void => {
    setUserUpdate({
      ...userUpdate,
      [key]: value,
    });
  };

  const cardData: EditCardData<User> = {
    header: PageMessages.profile.header,
    image: AccountBoxSharp,
    items: [{
      label: PageMessages.profile.emailHeader,
      value: user.email,
      readOnly: true,
      inputType: InputType.text,
    }, {
      label: PageMessages.profile.nameHeader,
      value: userUpdate.name || '',
      inputType: InputType.text,
      required: false,
      updateValue: (value): void => { updateState('name', value); },
    }, {
      label: PageMessages.profile.publicProfileHeader,
      value: userUpdate.publicProfile || false,
      inputType: InputType.boolean,
      required: true,
      updateValue: (value): void => { updateState('publicProfile', value); },
    }, {
      label: PageMessages.profile.descriptionHeader,
      value: userUpdate.description || '',
      inputType: InputType.text,
      required: false,
      updateValue: (value): void => { updateState('description', value); },
    }],
    buttons: [{
      variant: ButtonVariant.contained,
      classType: buttonClasses.save,
      label: ButtonMessage.Confirm,
      onClick: (): void => {
        updateUser(user.id, userUpdate);
        props.history.push(ProfilePath.profile);
      },
    }],
  };

  return (
    <>
      <div className={classes.container}>
        <EditCardComponent data={cardData} />
      </div>
    </>
  );
};

export const EditProfilePage = connect(
  (state: AppState): StateProps => ({
    user: userSelector.getCurrentUser(state),
  }),
  (dispatch): DispatchProps => (
    bindActionCreators({
      updateUser: userAction.startUpdateUser,
    }, dispatch)
  ),
)(withRouter(withLoading(BaseEditProfilePage, userSelector.getCurrentUserStatus)));
