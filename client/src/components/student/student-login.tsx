import React, { useState } from "react";
import { Container, Box, TextField, Button, Typography } from "@pankod/refine-mui";
import { useLogin } from "@pankod/refine-core";

type FormVariables = {
  email: string;
  password: string;
};

const StudentLogin: React.FC = () => {
  const { mutate: login, isLoading, error } = useLogin<FormVariables>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setErrorMessage("Please enter your email and password.");
      return;
    }

    // console.log('Login credentials:', { email, password });

    login({ email, password });
  };



  
  return (
    <Box
      sx={{
        backgroundColor: "#fcfcfc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
          }}
        >
          <Typography variant="h5" align="center" sx={{ mb: 3 }}>
            Student Login
          </Typography>

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMessage && (
            <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}

          {error && (
            <Typography variant="body2" color="error" align="center" sx={{ mb: 2 }}>
              {error.message}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Log In"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default StudentLogin;
