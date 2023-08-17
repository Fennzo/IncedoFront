import { useState } from 'react';
//import axios from "axios";
import { useNavigate } from "react-router";
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  FormHelperText, Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();
  const [method, setMethod] = useState('email');
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
 // const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    })
    // onSubmit: async (values, helpers) => {
    //   try {
    //     await auth.signIn(values.email, values.password);
    //     router.push('/');
    //   } catch (err) {
    //     helpers.setStatus({ success: false });
    //     helpers.setErrors({ submit: err.message });
    //     helpers.setSubmitting(false);
    //   }
    // }
  });

  // const handleMethodChange = (event, value) => {
  //   setMethod(value);
  // };

  const doLogin =()=>{
    if(username === 'admin@incedo.com' && password === 'admin@123'){
      navigate("/admin");
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
        localStorage.setItem('username', username)
        localStorage.setItem('token', token)
        localStorage.setItem('isLoggedIn', true)
        processRole(response.data.user.role);
      }
      catch(err){
        setErrorMsg('Invalid Credentials!!')
      }
    }
    login();
  }

  const processRole =(role)=>{
    //console.log(role)

    switch(role){
      case 'EXECUTIVE':
        navigate('/executive')
        break;
      case 'SUPPLIER':
        navigate('/supplier')
        break;
      default:
        setErrorMsg('Access Forbidden')
        break;
    }
  }


  return (
    <>
      <Head>
        <title>Login | Devias Kit</title>
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
            py: '100px',
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
            </Stack>
           {/* <Tabs onChange={handleMethodChange} sx={{ mb: 3 }} value={method}>
              <Tab label="Email" value="email" />
            </Tabs>*/}

                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.email && formik.errors.email)}
                    fullWidth
                    helperText={formik.touched.email && formik.errors.email}
                    label="Email Address"
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={(e)=>{
                      setUsername(e.target.value)
                      setErrorMsg('')}}
                    type="email"
                    value={username}
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={(e)=>{
                      setPassword(e.target.value)
                      setErrorMsg('')}}
                    type="password"
                    value={password}
                  />

                </Stack>
                {formik.errors.submit && (
                  <Typography color="error" sx={{ mt: 3 }} variant="body2">
                    {formik.errors.submit}
                  </Typography>
                )}
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
