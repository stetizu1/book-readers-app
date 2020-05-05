import React, { FC } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { MenuPath } from 'app/constants/Path';
import { MenuItemName } from 'app/messages/MenuItems';
import { OnChange } from 'app/types/EventTypes';
import { getMenuPathRoot } from 'app/helpers/getPathRoot';

import { useMenuStyle } from './MenuStyle';


const BaseMenu: FC<RouteComponentProps> = (props) => {
  const classes = useMenuStyle();
  const value = getMenuPathRoot(props.location.pathname);

  const handleChange: OnChange = (event, val) => props.history.push(val);
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
