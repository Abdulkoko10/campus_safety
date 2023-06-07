import { useState, useEffect, useRef } from "react";
import { useLogin } from "@pankod/refine-core";
import { Button, Container, Box, CssBaseline, Grid, Paper, Typography, Avatar, styled } from "@pankod/refine-mui";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { alhikmah } from "../assets";

import { CredentialResponse } from "../interfaces/google";

import { StudentSignUp, StudentLogin } from "components";

const defaultTheme = createTheme();

const Logo = styled('img')({
  maxWidth: '100%',
  height: 'auto',
  marginBottom: "1em",
  '@media (max-width:600px)': {
    width: '80%',
  },
});

const StyledGrid = styled(Grid)(({ theme }) => ({
  position: 'relative',
  '&::before': {
    content: '"Your safety is our concern"',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: theme.palette.common.white,
    opacity: 0.6,
    fontSize: '6rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
}));


export const Login: React.FC = () => {
  const { mutate: login, error: loginError } = useLogin<CredentialResponse>();

  const [formToShow, setFormToShow] = useState<"google" | "studentLogin" | "studentSignUp">("google");
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);

  const GoogleButton = (): JSX.Element => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (typeof window === "undefined" || !window.google || !divRef.current) {
        return;
      }

      try {
        window.google.accounts.id.initialize({
          ux_mode: "popup",
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: async (res: CredentialResponse) => {
            if (res.credential) {
              login(res);
            }
          },
        });
        window.google.accounts.id.renderButton(divRef.current, {
          theme: "filled_blue",
          size: "medium",
          type: "standard",
        });
      } catch (error) {
        console.log(error);
      }
    }, []); 

    return <div ref={divRef} />;
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <StyledGrid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(https://source.unsplash.com/random?security)`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div>
            <Logo src={alhikmah} alt="Alhikmah Logo" />
          </div>

        {formToShow === "google" && process.env.REACT_APP_GOOGLE_CLIENT_ID  && (
      <>
       <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {showGoogleLogin ? <GoogleButton /> : (
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={() => setShowGoogleLogin(true)}
            sx={{ mt: 3, mb: 2 }}
          >
            Security Staff Login
          </Button>
        )}
      </Typography>
      <Box mt={4}/>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => setFormToShow("studentLogin")}
              sx={{ mt: 3, mb: 2 }}
            >
              Login as Student
            </Button>
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => setFormToShow("studentSignUp")}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up as Student
            </Button>
          </>
        )}

        {formToShow === "studentLogin" && (
          <>
            <StudentLogin />
            {loginError && <div>Error: {loginError.message}</div>}
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => setFormToShow("google")}
              sx={{ mt: 3, mb: 2 }}
            >
              Back
            </Button>
          </>
        )}

        {formToShow === "studentSignUp" && (
          <>
            <StudentSignUp />
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => setFormToShow("google")}
              sx={{ mt: 3, mb: 2 }}
            >
              Back
            </Button>
          </>
        )}
      </Box>
    </Grid>
  </Grid>
);
};