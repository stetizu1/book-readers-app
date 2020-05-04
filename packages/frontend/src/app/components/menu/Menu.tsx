import React, { FC } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { History, Location } from 'history';

import { MenuPath } from '../../constants/Path';
import { MenuItemName } from '../../messages/MenuItems';
import { getPathRoot } from '../../helpers/getPathRoot';
import { useMenuStyle } from './MenuStyle';


interface RouterProps {
  history: History;
  location: Location;
}

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
      <Tab label={MenuItemName.home} value={MenuPath.home} />
      <Tab label={MenuItemName.library} value={MenuPath.library} />
      <Tab label={MenuItemName.reviews} value={MenuPath.reviews} />
      <Tab label={MenuItemName.friends} value={MenuPath.friends} />
      <Tab label={MenuItemName.wishlist} value={MenuPath.wishlist} />
      <Tab label={MenuItemName.borrows} value={MenuPath.borrows} />
    </Tabs>
  );
};

export const Menu = withRouter(BaseMenu);
