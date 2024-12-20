import React from 'react'
import { CiSearch } from 'react-icons/ci'
import Logo from './Logo'
import { BiMenuAltLeft } from 'react-icons/bi'
import { useContextValue } from '@/utils/hooks/Context'
import { BsSendArrowUp } from 'react-icons/bs'

const Header = () => {
  const { toggleSideBar } = useContextValue()
  return (
    <div className='w-full flex items-center justify-between p-3 gap-4 bg-white'>
      <div className='w-full'>
        <Logo />
      </div>
      <div className=' w-full outline-none border border-purple-300 rounded-3xl flex'>
        <input type="text" className='w-full outline-none text-xs m-2' />
        <div className='flex flex-col items-center justify-center w-10 h-8 text-purple-600'>
          <CiSearch size={20} />
        </div>
      </div>
      <div className="w-6 h-6 text-purple-600 flex items-center justify-center rounded-md" onClick={toggleSideBar}>
        <BsSendArrowUp size={20} />
      </div>
      <div className="w-6 h-6 text-purple-600 flex items-center justify-center rounded-md" onClick={toggleSideBar}>
        <BiMenuAltLeft size={20} />
      </div>
    </div>
  )
}

export default Header
