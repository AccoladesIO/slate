import React from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import Link from "next/link";
import { IoCloseOutline } from "react-icons/io5";
import { useContextValue } from "@/utils/hooks/Context";

interface SideBarProps {
  active: string;
}

const SideBar: React.FC<SideBarProps> = ({ active }) => {
  const { toggleSideBar } = useContextValue()

  console.log(active);

  const sideLink = [
    {
      id: 1,
      name: "Dashboard",
      href: "/dashboard",
      // icon: <RxHome />
    },
    {
      id: 2,
      name: "Canvas",
      href: "/dashboard/canvas",
      // icon: <RxFile />
    },
    {
      id: 3,
      name: "Teams",
      href: "/dashboard/teams",
      // icon: <BiStar />
    }
  ]


  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <motion.div
      className="h-[100vh] w-full max-w-[300px] absolute bg-white text-white"
      initial="closed"
      animate="open"
      exit="closed"
      variants={sidebarVariants}
    >
      <div className="w-full px-8 py-4 flex items-center justify-between ">
        <Logo />
        <span className="w-6 h-6 bg-purple-200 text-purple-600 flex items-center justify-center rounded-md" onClick={toggleSideBar}>
          <IoCloseOutline size={20} />
        </span>
      </div>
      <nav className="p-4">
        <ul className="space-y-4">
          {sideLink.map((_link, i) => (
            <div key={_link.id + _link.name + i} className={`w-full px-4 py-2 ${active === _link.name ? ' text-purple-500 font-bold border-r-4 border-r-purple-800' : "bg-white text-black/50"} hover:bg-slate-300`}>
              <Link href={_link.href} prefetch={false} className='w-full flex items-center justify-start gap-2 text-xs'>
                {/* {_link.icon} */}
                {_link.name}
              </Link>
            </div>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};

export default SideBar;
