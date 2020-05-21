import React, { FC } from 'react';

import { OtherMessage } from 'app/messages/OtherMessage';

import { useFooterStyle } from './useFooterStyle';


export const Footer: FC = () => {
  const classes = useFooterStyle();
  return (
    <footer className={classes.footer}>
      <div>{`© ${(new Date()).getFullYear()} Zuzana Štětinová`}</div>
      <div className={classes.href}>
        <div>{OtherMessage.about}</div>
        <div>
          {`${OtherMessage.openSource} `}
          <a href="https://github.com/stetizu1/book-readers-app">{OtherMessage.github}</a>
        </div>
      </div>
    </footer>
  );
};
