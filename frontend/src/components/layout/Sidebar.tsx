import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ClassIcon from '@mui/icons-material/Class';
import SubjectIcon from '@mui/icons-material/Subject';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar: React.FC = () => {
  const [openAcademic, setOpenAcademic] = React.useState(false);
  const [openAdmin, setOpenAdmin] = React.useState(false);

  const handleAcademicClick = () => {
    setOpenAcademic(!openAcademic);
  };

  const handleAdminClick = () => {
    setOpenAdmin(!openAdmin);
  };

  return (
    <List>
      <ListItem button component={Link} to="/dashboard">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Tableau de bord" />
      </ListItem>

      <ListItem button onClick={handleAcademicClick}>
        <ListItemIcon>
          <SchoolIcon />
        </ListItemIcon>
        <ListItemText primary="Académique" />
        {openAcademic ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openAcademic} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button component={Link} to="/students" sx={{ pl: 4 }}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Étudiants" />
          </ListItem>
          <ListItem button component={Link} to="/teachers" sx={{ pl: 4 }}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Enseignants" />
          </ListItem>
          <ListItem button component={Link} to="/classes" sx={{ pl: 4 }}>
            <ListItemIcon>
              <ClassIcon />
            </ListItemIcon>
            <ListItemText primary="Classes" />
          </ListItem>
          <ListItem button component={Link} to="/subjects" sx={{ pl: 4 }}>
            <ListItemIcon>
              <SubjectIcon />
            </ListItemIcon>
            <ListItemText primary="Matières" />
          </ListItem>
        </List>
      </Collapse>

      <ListItem button onClick={handleAdminClick}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Administration" />
        {openAdmin ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openAdmin} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button component={Link} to="/users" sx={{ pl: 4 }}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Utilisateurs" />
          </ListItem>
        </List>
      </Collapse>
    </List>
  );
};

export default Sidebar;
