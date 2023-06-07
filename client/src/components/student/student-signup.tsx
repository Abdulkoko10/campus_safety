import { useState } from "react";
import { Container, Box, TextField, Button } from "@pankod/refine-mui";
import { useRegister } from "@pankod/refine-core";

type FormVariables = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
};

const StudentSignUp: React.FC = () => {
  const { mutate: register } = useRegister<FormVariables>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhone] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    register({ name, email, password, phoneNumber });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#Fcfcfc",
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
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

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Sign Up
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default StudentSignUp;
