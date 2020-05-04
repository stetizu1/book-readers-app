import React, { FC } from 'react';
import { connect } from 'react-redux';
import { AccountBoxSharp } from '@material-ui/icons';

import { User } from 'book-app-shared/types/User';
import { isUndefined } from 'book-app-shared/helpers/typeChecks';

import { ButtonVariant } from '../../../constants/css/ButtonVariant';
import { PageMessages } from '../../../messages/PageMessages';
import { withLoading } from '../../helpers/withLoading';
import { userSelector } from '../../../modules/user/userSelector';
import { AppState } from '../../../modules/rootReducer';

import { ButtonMessage } from '../../../messages/ButtonMessage';
import { CardComponent, CardData } from '../../common/card/CardComponent';
import { useButtonStyle } from '../../common/ButtonsStyle';


interface StateProps {
  user: User | undefined;
}

type Props = StateProps;


const fillData = (
  email: string,
  publicProfile: boolean,
  name: string | null,
  description: string | null,
  buttonClasses: ReturnType<typeof useButtonStyle>,
): CardData<User> => ({
  header: PageMessages.profile.header,
  image: AccountBoxSharp,
  items: [
    {
      label: PageMessages.profile.emailHeader,
      value: email,
    },
    {
      label: PageMessages.profile.nameHeader,
      value: name,
    },
    {
      label: PageMessages.profile.publicProfileHeader,
      value: publicProfile,
    },
    {
      label: PageMessages.profile.descriptionHeader,
      value: description,
    },
  ],
  buttons: [
    {
      variant: ButtonVariant.contained,
      classType: buttonClasses.edit,
      label: ButtonMessage.Edit,
    },
  ],
});

const BaseProfilePage: FC<Props> = (props) => {
  const buttonClasses = useButtonStyle();

  if (isUndefined(props.user)) return null;

  const {
    email, publicProfile, name, description,
  } = props.user;
  const data = fillData(email, publicProfile, name, description, buttonClasses);
  return (
    <CardComponent data={data} />
  );
};

export const ProfilePage = connect(
  (state: AppState): StateProps => ({
    user: userSelector.getCurrentUser(state),
  }),
)(withLoading(userSelector.getCurrentUserStatus, BaseProfilePage));
