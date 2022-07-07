import React from 'react';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Box } from '@mui/material';
import { DashboardMenuItem, MenuItemLink, useSidebarState } from 'react-admin';
import products from '../components/products';
import SubMenu from './SubMenu';

const Menu = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [open] = useSidebarState();

  return (
    <Box
      sx={{
        width: open ? 200 : 50,
        marginTop: 1,
        marginBottom: 1,
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      <DashboardMenuItem />
      <SubMenu
        isOpen={isOpen}
        handleToggle={() => setIsOpen(!isOpen)}
        name="Products"
        icon={<products.icon />}
      >
        <MenuItemLink
          to="products"
          state={{ _scrollToTop: true }}
          primaryText="All products"
          leftIcon={<CategoryIcon />}
        />
        <MenuItemLink
          to="inventory"
          state={{ _scrollToTop: true }}
          primaryText="Inventory"
          leftIcon={<InventoryIcon />}
        />
      </SubMenu>
    </Box>
  );
};

export default Menu;
