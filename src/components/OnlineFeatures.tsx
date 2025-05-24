import React from 'react';
import { Box, Typography, Button, Card, CardContent, CardActions, Grid, Tooltip } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import CloudIcon from '@mui/icons-material/Cloud';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupIcon from '@mui/icons-material/Group';

interface OnlineFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  disabled: boolean;
}

const OnlineFeature: React.FC<OnlineFeatureProps> = ({ 
  icon, title, description, buttonText, onClick, disabled 
}) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {icon}
        <Typography variant="h6" component="div" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
    <CardActions>
      <Tooltip title={disabled ? "Login required" : ""} arrow>
        <span style={{ width: '100%' }}>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={onClick} 
            disabled={disabled}
            startIcon={disabled ? <LockIcon /> : null}
            fullWidth
          >
            {buttonText}
          </Button>
        </span>
      </Tooltip>
    </CardActions>
  </Card>
);

const OnlineFeatures: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // These would be actual actions in a real application
  const handleSaveGame = () => {
    alert("Game saved!");
  };
  
  const handleLeaderboard = () => {
    alert("Viewing leaderboard...");
  };

  const handleMultiplayer = () => {
    alert("Starting multiplayer game...");
  };

  return (
    <Box 
      sx={{ 
        position: 'absolute',
        bottom: 70, 
        left: 16, 
        zIndex: 1000,
        maxWidth: 400,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 2,
        p: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CloudIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="div">
          Online Features
        </Typography>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <OnlineFeature 
            icon={<SaveIcon />}
            title="Save Game"
            description="Save your progress to the cloud"
            buttonText="Save"
            onClick={handleSaveGame}
            disabled={!isAuthenticated}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <OnlineFeature 
            icon={<EmojiEventsIcon />}
            title="Leaderboard"
            description="Compare your scores with others"
            buttonText="View"
            onClick={handleLeaderboard}
            disabled={!isAuthenticated}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <OnlineFeature 
            icon={<GroupIcon />}
            title="Multiplayer"
            description="Play with friends online"
            buttonText="Start"
            onClick={handleMultiplayer}
            disabled={!isAuthenticated}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OnlineFeatures;
