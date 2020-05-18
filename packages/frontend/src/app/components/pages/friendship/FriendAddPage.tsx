import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { SearchSharp } from '@material-ui/icons';


import { ButtonType } from 'app/constants/style/types/ButtonType';

import { PageMessages } from 'app/messages/PageMessages';
import { ButtonMessage } from 'app/messages/ButtonMessage';

import { AppState } from 'app/types/AppState';

import { friendshipAction } from 'app/modules/friendship/friendshipAction';

import { FormCard, EditCardData } from 'app/components/blocks/card-components/form-card/FormCard';
import { getTextFormItem } from 'app/components/blocks/card-items/items-form/text/getTextFormItem';
import { getButton } from 'app/components/blocks/card-items/button/getButton';
import { getCardHeader } from 'app/components/blocks/card-layout/header/getCardHeader';
import { FoundUserComponent } from './FoundUserComponent';

interface DispatchProps {
  search: typeof friendshipAction.startReadUserByEmail;
}

type Props = DispatchProps;

const BaseFriendAddPage: FC<Props> = ({ search }) => {
  const [email, setEmail] = useState<string>('');
  const [isSearching, setSearch] = useState<boolean>(false);

  const cardData: EditCardData = {
    header: getCardHeader(PageMessages.friendship.addHeader, SearchSharp),
    items: [
      getTextFormItem({
        label: PageMessages.friendship.searching,
        value: email,
        updateValueFunction: (value: string): void => setEmail(value),
      }),
    ],
    buttons: [
      getButton({
        buttonType: ButtonType.save,
        label: ButtonMessage.Search,
        onClick: (): void => {
          search(email);
          setSearch(true);
        },
      }),
    ],
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
