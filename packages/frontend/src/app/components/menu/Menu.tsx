import React, { FC } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { History, Location } from 'history';

import { MenuItemName } from '../../messages/MenuItems';
import { useMenuStyle } from './MenuStyle';
import { Path } from '../../constants/Path';

interface RouterProps {
  history: History;
  location: Location;
}

const getPathRoot = (pathName: string): string => {
  const pathValues = pathName.split('/');
  if (pathValues.length <= 1) return Path.home;
  return `/${pathValues[1]}`;
};

const BaseMenu: FC<RouterProps> = (props) => {
  const classes = useMenuStyle();
  const value = getPathRoot(props.location.pathname);
  const handleChange = (event: React.ChangeEvent<{}>, val: string): void => props.history.push(val);
  return (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="menu"
      className={classes.menu}
      classes={{ indicator: classes.indicator }}
    >
      <Tab label={MenuItemName.home} value={Path.home} />
      <Tab label={MenuItemName.library} value={Path.library} />
      <Tab label={MenuItemName.reviews} value={Path.reviews} />
      <Tab label={MenuItemName.friends} value={Path.friends} />
      <Tab label={MenuItemName.wishlist} value={Path.wishlist} />
      <Tab label={MenuItemName.borrows} value={Path.borrows} />
    </Tabs>
  );
};

export const Menu = withRouter(BaseMenu);
