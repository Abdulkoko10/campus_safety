import React, { useContext, useState, useEffect } from "react";
import { useGetIdentity, useNotification } from "@pankod/refine-core";
import { AppBar, IconButton, Stack, Toolbar, Typography, Avatar, Button, Badge, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@pankod/refine-mui";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";

import { ColorModeContext } from "contexts";
import { getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

export const Header: React.FC = () => {
  const { mode, setMode } = useContext(ColorModeContext);
  const { data: user } = useGetIdentity();
  const shouldRenderHeader = true;

  const [notificationCount, setNotificationCount] = useState(0);
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState("");
  const [emergencyDescription, setEmergencyDescription] = useState("");
  const [emergencyLocation, setEmergencyLocation] = useState("");
  const { open: showNotification } = useNotification();

  useEffect(() => {
    if (!getApps().length) {
      initializeApp({
        apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
        authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_FIREBASE_APP_ID,
        measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
      });
    }
  
    const messaging = getMessaging();

    const requestPermissionAndSaveToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging);
          console.log("FCM device token:", token);
          if (user && user.id) {
            const response = await fetch(`/api/v1/users/${user.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                deviceToken: token,
              }),
            });
            if (response.ok) {
              console.log("Token saved successfully");
            } else {
              throw new Error("Failed to save token");
            }
          }
        } else {
          console.log("Permission not granted");
        }
      } catch (error) {
        console.log("Error requesting notification permission:", error);
      }
    };

    requestPermissionAndSaveToken();
  }, [user]);

  const handleEmergencyClick = () => {
    setEmergencyDialogOpen(true);
  };

  const handleEmergencySubmit = () => {
    // Perform any necessary validations on the emergency form fields

    // Trigger the emergency action based on the selected type
    switch (emergencyType) {
      case "Robbery":
      case "Assault":
      case "Fire":
      case "Other":
        sendEmergencyNotification(emergencyType, emergencyDescription, emergencyLocation);
        break;
      default:
        break;
    }

    setEmergencyDialogOpen(false);

    if (showNotification) {
      showNotification({
        type: "success",
        message: "Emergency Triggered",
        description: "Emergency request has been sent.",
      });
    }
  };

  const sendEmergencyNotification = async (emergencyType: string, description: string, location: string) => {
    try {
      const response = await fetch('/api/v1/users?role=SecurityStaff', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // Instead of just throwing an error, you might want to handle this case in a way that makes sense for your application
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const securityStaff = await response.json();
      const securityStaffTokens = securityStaff.map((user: { deviceToken: any }) => user.deviceToken);

      const payload = {
        notification: {
          title: "Emergency Alert",
          body: `Emergency: ${emergencyType}`,
          sound: "default",
        },
        data: {
          description: description,
          location: location,
        },
      };

      const notificationResponse = await fetch('/api/sendNotification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payload: payload,
          tokens: securityStaffTokens,
        }),
      });

      if (notificationResponse.ok) {
        console.log("Emergency notification sent successfully");
      } else {
        throw new Error("Failed to send emergency notification");
      }
    } catch (error) {
      console.log("Error sending emergency notification:", error);
    }
  };

  return shouldRenderHeader ? (
    <>
      <AppBar color="default" position="sticky" elevation={0} sx={{ background: "#fcfcfc" }}>
        <Toolbar>
          <Stack
            direction="row"
            width="100%"
            justifyContent="space-between"
            alignItems="center"
          >
            <Badge color="error" badgeContent={notificationCount}>
              <Button
                variant="contained"
                color="error"
                onClick={handleEmergencyClick}
                sx={{
                  animation: `$blink 2s infinite`,
                  "@keyframes blink": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                  },
                }}
              >
                Emergency
              </Button>
            </Badge>
            <Stack direction="row" gap="16px" alignItems="center" justifyContent="center">
              {user?.name ? <Typography variant="subtitle2">{user?.name}</Typography> : null}
              {user?.avatar ? <Avatar src={user?.avatar} alt={user?.name} /> : null}
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      <Dialog open={emergencyDialogOpen} onClose={() => setEmergencyDialogOpen(false)}>
        <DialogTitle>Select Emergency Type</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Emergency Type"
            fullWidth
            value={emergencyType}
            onChange={(e) => setEmergencyType(e.target.value)}
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select</option>
            <option value="Robbery">Robbery</option>
            <option value="Assault">Assault</option>
            <option value="Fire">Fire</option>
            <option value="Other">Other</option>
          </TextField>
          {emergencyType === "Other" && (
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={emergencyDescription}
              onChange={(e) => setEmergencyDescription(e.target.value)}
            />
          )}
          {emergencyType && (
            <TextField
              label="Location"
              fullWidth
              value={emergencyLocation}
              onChange={(e) => setEmergencyLocation(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmergencyDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleEmergencySubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ) : null;
};
