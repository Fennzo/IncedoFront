import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Box, Button, FormHelperText, Link, Stack, TextField, Typography } from '@mui/material';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';

const Page = () => {
  const router = useRouter();
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const doLogin =()=>{
    if(username === 'admin@incedo.com' && password === 'admin@123'){
      router.push("/admin");
      return;
    }
    async function login(){
      try{
        let token = window.btoa(username + ':' + password);
        const response
          = await axios.get('http://localhost:8282/auth/login',{
          headers:{
            'Authorization': 'Basic ' + token
          }
        });
        localStorage.setItem('userObj', JSON.stringify(response.data));
        localStorage.setItem('street', response.data.address.street)
        localStorage.setItem('hno', response.data.address.hno)
        localStorage.setItem('zipcode', response.data.address.zipcode)
        localStorage.setItem('contact', response.data.contact)
        localStorage.setItem('city', response.data.address.city)
        localStorage.setItem('name', response.data.name)
        localStorage.setItem('username', username)
        localStorage.setItem('id', response.data.id)
        localStorage.setItem('token', token)
        localStorage.setItem('isLoggedIn', true)

       // console.log("logged in contact", localStorage.getItem("contact"))
        processRole(response.data.user.role);
      }
      catch(err){
        console.log("login error", err)
        setErrorMsg('Invalid Credentials!!')
      }
    }
    login();
  }

  const processRole =(role)=>{
    //console.log(role)

    switch(role){
      case 'EXECUTIVE':
        router.push('/executive')
        break;
      case 'SUPPLIER':
        router.push('/supplier')
        break;
      case 'MANAGER':
        router.push("/manager")
        break
      case "CUSTOMER":
        router.push("/customer")
        break;
      default:
        setErrorMsg('Access Forbidden')
        break;
    }
  }


  return (
    <>
      <Head>
        <title>Login | Incedo</title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'left',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '350px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">Login</Typography>
              <Typography color="text.secondary" variant="body2">
                Don&apos;t have an account?&nbsp;
                <Link component={NextLink} href="/auth/register" underline="hover" variant="subtitle2">
                  Register
                </Link>
              </Typography>

              <Typography color="text.secondary" variant="body2">
                Need some help here? &nbsp;
                <Link component={NextLink} href="/auth/resetpasswordfirst" underline="hover" variant="subtitle2">
                  Forgot Password
                </Link>
              </Typography>
            </Stack>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    onChange={(e)=>{
                      setUsername(e.target.value)
                      setErrorMsg('')}}
                    type="email"
                    value={username}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    onChange={(e)=>{
                      setPassword(e.target.value)
                      setErrorMsg('')}}
                    type="password"
                    value={password}
                  />
                  {errorMsg && ( // Only render FormHelperText if errorMsg is not empty
                    <FormHelperText>
                      {errorMsg}
                    </FormHelperText>)}
                </Stack>
                <Button fullWidth size="large" sx={{ mt: 3 }} onClick={()=>doLogin()} variant="contained">
                  Continue
                </Button>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
