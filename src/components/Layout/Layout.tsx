import React from 'react'
import Header from '../ui/Header';
import SideBar from '../ui/SideBar';

interface LayoutProp {
    children: React.ReactNode;
    active: string;
}
const Layout: React.FC<LayoutProp> = ({ children, active }) => {
    return (
        <div className='w-full flex relative'>
            <SideBar active={active} />
            <div className='w-full sm:mb-0 mb-10'>
                <Header />
                {children}
            </div>
            {/* <Bottomnav active={active} /> */}
        </div>
    )
}

export default Layout
