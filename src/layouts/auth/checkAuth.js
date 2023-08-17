import { useEffect } from 'react';
import { useRouter } from 'next/router';

function CheckAuth() {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is logged in
    const userIsLoggedIn = localStorage.getItem('username') !== null;
    console.log("userloggedin", userIsLoggedIn)
    // Redirect to the login page if the user is not logged in
    if (!userIsLoggedIn) {
      router.push('/auth/login');
    }
  }, []);
};

export default CheckAuth