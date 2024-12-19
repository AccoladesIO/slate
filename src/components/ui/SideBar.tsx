import React from 'react'
import Logo from './Logo'

const SideBar = ({ active }: { active: string }) => {

  console.log(active)
  return (
    <div className='h-[100vh] w-52 hidden sm:flex flex-col justify-between items-center gap-2 bg-slate-400'>
      <Logo />
    </div>
  )
}

export default SideBar
