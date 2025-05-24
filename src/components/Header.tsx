import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar, 
  Box, 
  Dialog, 
  DialogContent,
  DialogTitle,
  Typography,
  IconButtonProps
} from '@mui/material';
import { AccountCircle, Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { logout as apiLogout } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const CloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  position: 'absolute',
  right: 8,
  top: 8,
  color: theme.palette.grey[500]
}));

const CustomDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle {...other} sx={{ m: 0, p: 2 }}>
      {children}
      {onClose ? (
        <CloseButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </CloseButton>
      ) : null}
    </DialogTitle>
  );
};

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  
  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      logout();
      handleClose();
    },
  });

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logoutMutation.mutate();
  };

  const handleLoginClick = () => {
    handleClose();
    setLoginDialogOpen(true);
  };

  const handleAboutClick = () => {
    handleClose();
    setAboutDialogOpen(true);
  };

  const closeLoginDialog = () => {
    setLoginDialogOpen(false);
  };

  const closeAboutDialog = () => {
    setAboutDialogOpen(false);
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <>      <AppBar position="absolute" color="transparent" elevation={0} sx={{ top: 0, right: 0, left: 'auto', width: 'auto' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
                boxShadow: 2
              }}
            >
              <Avatar sx={{ bgcolor: isAuthenticated ? 'primary.main' : 'grey.500' }}>
                {isAuthenticated && user?.username 
                  ? getInitials(user.username) 
                  : <AccountCircle />
                }
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {isAuthenticated ? (
                [
                  <MenuItem key="user-info" disabled>
                    <Typography variant="body2">
                      Signed in as <strong>{user?.username}</strong>
                    </Typography>
                  </MenuItem>,
                  <MenuItem key="about" onClick={handleAboutClick}>About</MenuItem>,
                  <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>
                ]
              ) : (
                [
                  <MenuItem key="guest-info" disabled>
                    <Typography variant="body2">
                      <strong>Guest User</strong>
                    </Typography>
                  </MenuItem>,
                  <MenuItem key="about" onClick={handleAboutClick}>About</MenuItem>,
                  <MenuItem key="login" onClick={handleLoginClick}>Login</MenuItem>
                ]
              )}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* Login Dialog */}
      <Dialog 
        open={loginDialogOpen} 
        onClose={closeLoginDialog}
        fullWidth
        maxWidth="sm"
      >        <CustomDialogTitle id="login-dialog-title" onClose={closeLoginDialog}>
          Login
        </CustomDialogTitle>
        <DialogContent>
          <LoginForm onLoginSuccess={closeLoginDialog} isDialog={true} />
        </DialogContent>
      </Dialog>

      {/* About Dialog */}
      <Dialog
        open={aboutDialogOpen}
        onClose={closeAboutDialog}
        fullWidth
        maxWidth="sm"
      >
        <CustomDialogTitle id="about-dialog-title" onClose={closeAboutDialog}>
          About Breaking Walls
        </CustomDialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Breaking Walls is an interactive maze game that challenges players to navigate through complex mazes.
          </Typography>
          <Typography variant="body1" paragraph>
            Create an account to access online gameplay features, save your progress, and compete with other players.
          </Typography>
          <Typography variant="body1">
            Built with React, TypeScript, and WebAssembly for a fast and responsive gaming experience.
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
