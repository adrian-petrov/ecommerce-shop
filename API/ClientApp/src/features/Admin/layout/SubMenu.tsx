import React, { ReactElement, ReactNode } from 'react';
import { ExpandMore } from '@mui/icons-material';
import {
  Collapse,
  List,
  ListItemIcon,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSidebarState } from 'react-admin';

interface Props {
  icon: ReactElement;
  isOpen: boolean;
  handleToggle: () => void;
  name: string;
  children: ReactNode;
}

const SubMenu = (props: Props) => {
  const { isOpen, handleToggle, name, icon, children } = props;
  const [sidebarIsOpen] = useSidebarState();

  const header = (
    <MenuItem onClick={handleToggle}>
      <ListItemIcon sx={{ minWidth: 5 }}>
        {isOpen ? <ExpandMore /> : icon}
      </ListItemIcon>
      <Typography sx={{ marginLeft: 0.5 }} variant="inherit">
        {name}
      </Typography>
    </MenuItem>
  );

  return (
    <div>
      {sidebarIsOpen || isOpen ? (
        header
      ) : (
        <Tooltip title={name} placement="right">
          {header}
        </Tooltip>
      )}
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List
          dense
          component="div"
          disablePadding
          sx={{
            '& a': {
              transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
              paddingLeft: sidebarIsOpen ? 4 : 2,
            },
          }}
        >
          {children}
        </List>
      </Collapse>
    </div>
  );
};

export default SubMenu;
