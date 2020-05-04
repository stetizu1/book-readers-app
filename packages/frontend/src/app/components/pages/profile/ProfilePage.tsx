import React, { FC } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AccountBoxSharp } from '@material-ui/icons';

import { User } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ButtonVariant } from '../../../constants/css/ButtonVariant';
import { PageMessages } from '../../../messages/PageMessages';
import { withLoading } from '../../helpers/withLoading';
import { userSelector } from '../../../modules/user/userSelector';
import { AppState } from '../../../modules/rootReducer';

import { ButtonMessage } from '../../../messages/ButtonMessage';
import { CardComponent, CardData } from '../../common/CardComponent';
import { useButtonStyle } from '../../common/styles/ButtonsStyle';
import { ConfirmationDialogComponent } from '../../common/ConfirmationDialogComponent';
import { useProfilePageStyle } from './ProfilePageStyle';
import { userAction } from '../../../modules/user/userAction';
import { dialogSelector } from '../../../modules/dialog/dialogSelector';
import { dialogAction } from '../../../modules/dialog/dialogAction';


interface StateProps {
  user: User | undefined;
  isConfirmDialogOpen: boolean;
}

interface DispatchProps {
  deleteUser: typeof userAction.startDeleteUser;
  setDialogState: typeof dialogAction.setOpen;
}

type Props = StateProps & DispatchProps;

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
)(withLoading(userSelector.getCurrentUserStatus, BaseProfilePage));
