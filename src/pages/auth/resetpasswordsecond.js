import axios from 'axios';
import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { router } from 'next/client';

function ResetPasswordSecond(props) {
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetPassword = async () => {
    if (password !== repassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8282/auth/reset/db', {
        token: window.btoa(props.username + ':' + password),
      });
      setSuccessMsg('Password reset successful');
      setErrorMsg('');
    } catch (err) {
      setErrorMsg('Password reset failed');
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
          <div className="card">
            <div className="card-body">
              {successMsg ? (
                <div className="alert alert-info" role="alert">
                  {successMsg}&nbsp;&nbsp;
                  <label>Go to: </label>&nbsp;
                  <Button variant="text" color="primary" onClick={() => router.push('/auth/login')}>
                    Login
                  </Button>
                </div>
              ) : errorMsg ? (
                <div className="alert alert-danger" role="alert">
                  {errorMsg}
                </div>
              ) : null}
              <TextField
                fullWidth
                label="Enter New Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                fullWidth
                label="Re-enter Your Password"
                name="repassword"
                type="password"
                value={repassword}
                onChange={(e) => setRepassword(e.target.value)}
              />
              <Button fullWidth variant="contained" color="primary" onClick={() => resetPassword()}>
                Reset Password
              </Button>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
}

export default ResetPasswordSecond;
