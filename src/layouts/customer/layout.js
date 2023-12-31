import React, { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { SideNav } from './side-nav';
import { TopNav } from './top-nav';
import { router } from 'next/client';

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: SIDE_NAV_WIDTH
  }
}));

const LayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%'
});

export const Layout = (props) => {
  const { children, selectedCategory } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);
  // Check if the current URL matches '/customers'
  const showSideNav = router.pathname === '/customers';

  const handlePathnameChange = useCallback(
    () => {
      if (openNav) {
        setOpenNav(false);
      }
    },
    [openNav]
  );

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  return (
    <>
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <SideNav
        onClose={() => setOpenNav(false)}
        open={openNav}
        setSelectedCategory={props.setSelectedCategory} // Pass setSelectedCategory as a prop
        selectedCategory={selectedCategory}
      />
      <LayoutRoot>
        <LayoutContainer>
          {React.cloneElement(children, { selectedCategory: selectedCategory || 0 })}
        </LayoutContainer>
      </LayoutRoot>
    </>
  );
};
