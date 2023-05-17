import React from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {useNavigate} from "react-router-dom";
import Axios from "axios";

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import ListItemButton from '@mui/material/ListItemButton';
import { styled, useTheme } from '@mui/material/styles';

const drawerWidth = 240;

function MyAppBar() {
  const navigate = useNavigate();
  Axios.defaults.withCredentials = true;

  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [open, setOpen] = React.useState(false);

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));


  const userProfile = () => {
    setAnchorElUser(null);
    navigate("/user/profile");
  }

  const setPassword = () => {
    setAnchorElUser(null);
    navigate("/user/settings")
  }

  const userLogout = () => {
    setAnchorElUser(null);
    Axios.delete("https://mathflix.herokuapp.com/logout").then((response)=> {
      if(response){
        navigate("/", {replace: true})
      }
    })
    console.log("Logout");
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const HandleCourseMenu = () => {
    setAnchorElNav(null);
    navigate("/");
  };

  const handleGamesMenu = () => {
    setAnchorElNav(null);
    navigate("/games/games-list");
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };



  return (
    <AppBar style={{ background: '#EF8172' }} position="static">
      <Container maxWidth="4080px">
        
        <Toolbar disableGutters>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
        </IconButton>
        <img src='/images/logo.png' alt="logo" style= {{height: "50px", width: "50px"}}/>

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 1, md: 'flex' },
              fontFamily: 'croissant one',
              fontWeight: 700,
              letterSpacing: '.0rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            Math
          </Typography>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              ml: -2,
              display: { xs: 1, md: 'flex' },
              fontFamily: 'croissant one',
              fontWeight: 700,
              letterSpacing: '.0rem',
              color: 'red',
              textDecoration: 'none',
            }}
          >
            Flix
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 1, md: 'flex' }}}></Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="John Doe" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >

              <MenuItem  onClick={userProfile}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>

              <MenuItem  onClick={setPassword}>
                <Typography textAlign="center">Settings</Typography>
              </MenuItem>

              <MenuItem  onClick={userLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>


            </Menu>
          </Box>
        </Toolbar>
      </Container>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
        <ListItemButton>
              <Button
                onClick={HandleCourseMenu}
                sx={{ my: 1, color: 'black', display: 'block', paddingRight: '100%' }}
              > Courses
              </Button>
        </ListItemButton>
        <ListItemButton onClick={handleDrawerClose}>
              <Button
                onClick={handleGamesMenu}
                sx={{ my: 1, color: 'black', display: 'block', paddingRight: '100%' }}
              > Games
              </Button>
          </ListItemButton>
        </List>
      </Drawer>
    </AppBar>
  );
}
export default MyAppBar;