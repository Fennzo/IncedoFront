import { useState } from 'react';
import axios from 'axios';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';

function ResetPasswordFirst() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [safetyPin, setSafetyPin] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [validStatus, setValidStatus] = useState('');

  const verify = async () => {
    try {
      const response = await axios.put('http://localhost:8282/auth/password-reset', {
        username: username,
        safetyPin: safetyPin,
      });
      setSuccessMsg(response.data.msg);
      setValidStatus('true');
    } catch (err) {
      setErrorMsg(err.response.data.msg);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        flex: '1 1 auto',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        py: 8,
      }}
    >
      <Box
        sx={{
          maxWidth: 550,
          px: 3,
          width: '100%',
        }}
      >
        <div>
          <Typography variant="h4">Reset Password</Typography>
          {validStatus === '' ? (
            <div>
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  verify();
                }}
              >
                <Stack spacing={2} sx={{ mt: 3 }}>
                  {successMsg ? (
                    <Typography variant="body1" color="primary">
                      {successMsg}
                    </Typography>
                  ) : errorMsg ? (
                    <Typography variant="body1" color="error">
                      {errorMsg}
                    </Typography>
                  ) : null}
                  <TextField
                    fullWidth
                    label="Enter Username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Enter Safety Pin for Verification"
                    name="safetyPin"
                    value={safetyPin}
                    onChange={(e) => setSafetyPin(e.target.value)}
                    variant="outlined"
                  />
                  <Button fullWidth variant="contained" color="primary" type="submit">
                    Verify
                  </Button>
                </Stack>
              </Box>
            </div>
          ) : (
            <div>
              {/* Show ResetPasswordSecond component */}
            </div>
          )}
        </div>
      </Box>
    </Box>
  );
}

export default ResetPasswordFirst;
