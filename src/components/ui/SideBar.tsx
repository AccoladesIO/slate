import React from 'react'
import Logo from './Logo'

const SideBar = ({ active }: { active: string }) => {

  console.log(active)
  return (
    <div className='h-[100vh] w-full max-w-[300px] absolute bg-black/50'>
      <Logo />
    </div>
  )
}

export default SideBar
