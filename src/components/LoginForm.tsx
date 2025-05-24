import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login as apiLogin, register as apiRegister, LoginCredentials, RegisterCredentials } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Alert, 
  Tabs, 
  Tab
} from '@mui/material';

interface LoginFormProps {
  onLoginSuccess?: () => void;
  isDialog?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, isDialog = false }) => {  const [tabIndex, setTabIndex] = useState(0);
  const [loginCredentials, setLoginCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [registerCredentials, setRegisterCredentials] = useState<RegisterCredentials>({
    username: '',
    password: '',
    email: ''
  });
  const { login } = useAuth();
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => apiLogin(credentials),
    onSuccess: (data) => {
      login(data.user, data.token);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    },
  });
  
  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => apiRegister(credentials),
    onSuccess: (data) => {
      login(data.user, data.token);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    },
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginCredentials((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginCredentials);
  };
  
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerCredentials);
  };  const formContent = (
    <>
      <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
        <Tab label="Login" id="login-tab" />
        <Tab label="Register" id="register-tab" />
      </Tabs>
      
      {/* Login Tab Panel */}
      {tabIndex === 0 && (
        <>
          {loginMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Invalid username or password
            </Alert>
          )}
          
          <form onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={loginCredentials.username}
              onChange={handleLoginChange}
              margin="normal"
              required
              autoFocus={tabIndex === 0}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              value={loginCredentials.password}
              onChange={handleLoginChange}
              margin="normal"
              type="password"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </>
      )}
      
      {/* Register Tab Panel */}
      {tabIndex === 1 && (
        <>
          {registerMutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Registration failed. User might already exist.
            </Alert>
          )}
          
          <form onSubmit={handleRegisterSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={registerCredentials.username}
              onChange={handleRegisterChange}
              margin="normal"
              required
              autoFocus={tabIndex === 1}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={registerCredentials.email}
              onChange={handleRegisterChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              value={registerCredentials.password}
              onChange={handleRegisterChange}
              margin="normal"
              type="password"
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={registerMutation.isLoading}
            >
              {registerMutation.isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </>
      )}
    </>
  );

  // When used in a dialog, just return the form content
  if (isDialog) {
    return formContent;
  }

  // When used standalone (full page), wrap in Box/Paper
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ p: 4, width: '100%', maxWidth: 400 }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Breaking Walls
        </Typography>
        <Typography variant="h6" gutterBottom align="center">
          Login
        </Typography>

        {formContent}
      </Paper>
    </Box>
  );
};

export default LoginForm;
