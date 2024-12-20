import React from 'react'
import Header from '../ui/Header';
import SideBar from '../ui/SideBar';
import { useContextValue } from '@/utils/hooks/Context';

interface LayoutProp {
    children: React.ReactNode;
    active: string;
}
const Layout: React.FC<LayoutProp> = ({ children, active }) => {
    const { sideBarOpen } = useContextValue()
    return (
        <div className='w-full flex relative'>
            {
                sideBarOpen &&
                <SideBar active={active} />
            }
            <div className='w-full sm:mb-0 mb-10'>
                <Header />
                {children}
            </div>
            {/* <Bottomnav active={active} /> */}
        </div>
    )
}

export default Layout
