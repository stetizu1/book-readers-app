import React, { FC } from 'react';

import { useFooterStyle } from './FooterStyle';


export const Footer: FC = () => {
  const classes = useFooterStyle();
  return (
    <footer className={classes.footer}>
      {`© ${(new Date()).getFullYear()} Zuzana Štětinová`}
    </footer>
  );
};
