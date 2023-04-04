import { useContext, useState } from 'react';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Add, PieChart, Logout, Home, LunchDining, MonitorWeight, CalendarMonth, Surfing } from '@mui/icons-material/';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/user.context';

// import BoxItem from '@material-ui/core/Box';

const NavBar = () => {
  const [show, setShow] = useState(false);
  const { logOutUser } = useContext(UserContext);
  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setShow(show => !show);
  };
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: "none", color: "white" }}>
            SugarSavvy
          </Typography>
          <Box m={2}>
            <Button variant="contained" onClick={logOutUser}>Logout</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <TemporaryDrawer show={show} setShow={setShow} toggleDrawer={toggleDrawer} />
    </>
  );
};

const TemporaryDrawer = (props) => {
  const { show, toggleDrawer } = props;
  const { logOutUser } = useContext(UserContext);

  const logOut = async () => {
    await logOutUser();
    window.location.reload(true);
    return;
  }

  const navLinks = [
    {
      text: 'Home',
      Icon: Home,
      link: '/',
    },
    {
      text: 'Weight Analytics',
      Icon: MonitorWeight,
      link: '/weightanalytics',
    },
    {
      text: 'Blood Sugar Level Analytics',
      Icon: PieChart,
      link: '/bloodsugarlevelanalytics',
    },
    {
      text: 'Exercise Analytics',
      Icon: Surfing,
      link: '/exerciseAnalytics',
    },
    {
      text: 'Analytics Dashboard',
      text: 'Food Tracker', // should be another diet analytics page
      Icon: LunchDining,
      link: '/dietentries',
    },
    {
      text: 'Appointment',
      Icon: CalendarMonth,
      link: '/appointment',
    },
    {
      text: 'Logout',
      Icon: Logout,
      action: logOut,
    },
  ];

  const DrawerList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        {
          navLinks.map(({ text, Icon, link, action }) => {
            return link ?
              <Link to={link} style={{ textDecoration: "none", color: "inherit" }} key={text}>
                <ListItem button>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
              :
              <ListItem button onClick={action} key={text}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
          })
        }
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer
        open={show}
        onClose={toggleDrawer}>
        {<DrawerList />}
      </Drawer>
    </div>
  );
}

export default NavBar;