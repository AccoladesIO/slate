import React from 'react'
import Logo from './Logo'

const SideBar = ({ active }: { active: string }) => {
  return (
    <div className='h-[100vh] w-52 hidden sm:flex flex-col justify-between items-center gap-2 bg-slate-400'>
      <Logo />
    </div>
  )
}

export default SideBar
