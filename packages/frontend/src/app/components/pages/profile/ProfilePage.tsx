import React, { FC } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AccountBoxSharp } from '@material-ui/icons';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { User } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ButtonVariant } from 'app/constants/style/ButtonVariant';
import { ProfilePath } from 'app/constants/Path';
import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';
import { AppState } from 'app/types/AppState';

import { userSelector } from 'app/modules/user/userSelector';

import { userAction } from 'app/modules/user/userAction';
import { dialogSelector } from 'app/modules/dialog/dialogSelector';
import { dialogAction } from 'app/modules/dialog/dialogAction';

import { withLoading } from 'app/components/helpers/withLoading';
import { CardComponent, CardData } from 'app/components/common/CardComponent';
import { ConfirmationDialogComponent } from 'app/components/common/ConfirmationDialogComponent';

import { useButtonStyle } from 'app/components/common/styles/ButtonsStyle';
import { useProfilePageStyle } from './ProfilePageStyle';


interface StateProps {
  user: User | undefined;
  isConfirmDialogOpen: boolean;
}

interface DispatchProps {
  deleteUser: typeof userAction.startDeleteUser;
  setDialogState: typeof dialogAction.setOpen;
}

type Props = StateProps & DispatchProps & RouteComponentProps;

const BaseProfilePage: FC<Props> = (props) => {
  const buttonClasses = useButtonStyle();
  const classes = useProfilePageStyle();

  const user = props.user;
  if (isUndefined(user)) return null;

  const cardData: CardData<User> = {
    header: PageMessages.profile.header,
    image: AccountBoxSharp,
    items: [{
      label: PageMessages.profile.emailHeader,
      value: user.email,
    }, {
      label: PageMessages.profile.nameHeader,
      value: user.name,
    }, {
      label: PageMessages.profile.publicProfileHeader,
      value: user.publicProfile,
    }, {
      label: PageMessages.profile.descriptionHeader,
      value: user.description,
    }],
    buttons: [{
      variant: ButtonVariant.text,
      classType: buttonClasses.deleteOption,
      label: ButtonMessage.DeleteProfile,
      onClick: (): void => {
        props.setDialogState(true);
      },
    }, {
      variant: ButtonVariant.contained,
      classType: buttonClasses.edit,
      label: ButtonMessage.Edit,
      onClick: (): void => {
        props.history.push(ProfilePath.edit);
      },
    }],
  };

  const confirmationData = {
    header: PageMessages.profile.delete.header,
    text: PageMessages.profile.delete.description,
    onCancelClick: (): void => {
      props.setDialogState(false);
    },
    confirmButton: {
      classType: buttonClasses.deleteButton,
      onClick: (): void => {
        props.deleteUser(user.id);
      },
    },
  };

  return (
    <>
      <div className={classes.container}>
        <CardComponent data={cardData} />
      </div>
      <ConfirmationDialogComponent data={confirmationData} isOpen={props.isConfirmDialogOpen} />
    </>
  );
};

export const ProfilePage = connect(
  (state: AppState): StateProps => ({
    user: userSelector.getCurrentUser(state),
    isConfirmDialogOpen: dialogSelector.getIsOpen(state),
  }),
  (dispatch): DispatchProps => (
    bindActionCreators({
      deleteUser: userAction.startDeleteUser,
      setDialogState: dialogAction.setOpen,
    }, dispatch)
  ),
)(withRouter(withLoading(BaseProfilePage, userSelector.getCurrentUserStatus)));
