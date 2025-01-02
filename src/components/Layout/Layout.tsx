import React from "react";
import { AnimatePresence } from "framer-motion";
import Header from "../ui/Header";
import SideBar from "../ui/SideBar";
import { useContextValue } from "@/utils/hooks/Context";

interface LayoutProp {
    children: React.ReactNode;
    active: string;
}

const Layout: React.FC<LayoutProp> = ({ children, active }) => {
    const { sideBarOpen } = useContextValue();

    return (
        <div className="w-full flex relative">
            <AnimatePresence>
                {sideBarOpen && <SideBar active={active} />}
            </AnimatePresence>
            <div className="w-full sm:mb-0 mb-10">
                <Header />
                {children}
            </div> 
        </div>
    );
};

export default Layout;
