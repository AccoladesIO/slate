import React from 'react'
import { CiSearch } from 'react-icons/ci'
import Logo from './Logo'

const Header = () => {
  return (
    <div className='w-full flex items-center justify-between p-3 gap-4 bg-white'>
      <div className='flex sm:hidden'>
        <Logo />
      </div>
      <div className=' w-[70%] outline-none border border-purple-300 p-1 rounded-3xl flex'>
        <input type="text" className='w-full outline-none text-xs ml-2' />
        <div className='flex items-center justify-center w-10 h-10'>
          <CiSearch size={20} color='purple' />
        </div>
      </div>
    </div>
  )
}

export default Header
