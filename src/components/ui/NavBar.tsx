import React from 'react';
import Logo from './Logo';
import { useRouter } from 'next/router';

const NavBar = () => {
  const router = useRouter()

  return (
    <div className="w-[95%] max-w-[1200px] mx-auto p-3 rounded-lg fixed top-2 left-0 right-0 bg-white shadow-md flex items-center justify-between z-20">
      <Logo />
      <div className=' flex items-center justify-end bg-purple-500 text-white p-2 rounded-md text-sm cursor-pointer' onClick={() => router.push('/auth/login')}>Join for free</div>
    </div>
  );
};

export default NavBar;
