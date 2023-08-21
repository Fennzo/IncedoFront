import {useEffect} from 'react';
import {useRouter} from 'next/router';

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if localStorage is empty
    const isLoggedIn = localStorage.getItem('yourLocalStorageKey'); // Replace with your actual key

    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      router.replace('/auth/login'); // Replace with your login route
    } else {
      // Redirect to dashboard if logged in
      router.replace('/dashboard'); // Replace with your dashboard route
    }
  }, []); // Empty dependency array to run the effect only once

  return null; // Return null since there's no content in this component
};

export default IndexPage;
