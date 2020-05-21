import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { SearchSharp } from '@material-ui/icons';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';

import { friendshipAction } from 'app/modules/friendship/friendshipAction';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { FoundUserComponent } from './FoundUserComponent';
import { getButton } from '../../blocks/card-items/button/getButton';
import { ButtonType } from '../../../constants/style/types/ButtonType';


interface DispatchProps {
  search: typeof friendshipAction.startReadUserByEmail;
}

type Props = DispatchProps;

const messages = PageMessages.friendship;

const BaseFriendAddPage: FC<Props> = ({ search }) => {
  const [email, setEmail] = useState<string>('');
  const [isSearching, setSearch] = useState<boolean>(false);

  const cardData: EditCardData = {
    header: getCardHeader(messages.addHeader, SearchSharp),
    items: [
      getTextFormItem({
        label: messages.descriptions.searching,
        value: email,
        updateValueFunction: (value: string): void => setEmail(value),
      }),
    ],
    button: getButton({
      buttonType: ButtonType.save,
      label: ButtonMessage.Search,
      onClick: (): void => {
        search(email);
        setSearch(true);
      },
    }),
  };

  return (
    <>
      <FormCard data={cardData} />
      {isSearching && (
        <FoundUserComponent />
      )}
    </>
  );
};

export const FriendAddPage = connect<{}, DispatchProps, {}, AppState>(
  null,
  {
    search: friendshipAction.startReadUserByEmail,
  },
)(BaseFriendAddPage);
