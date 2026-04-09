/* eslint-disable */

import { HiX } from "react-icons/hi";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Logo from "../header/Logo";
import Links from "./components/Links";

import SidebarCard from "components/sidebar/componentsrtl/SidebarCard";
import routes from "routes";

const Sidebar = ({ open, onClose, onToggle }) => {
  const secondaryRoutes = routes.filter((route) => route.secondary);
  return (
    <>
      <div
        className={`sm:none duration-175 linear fixed !z-50 flex h-full w-[250px] flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white ${
          open ? "translate-x-0" : "-translate-x-[250px]"
        }`}
      >
        <span
          className="absolute right-4 top-4 block cursor-pointer xl:hidden"
          onClick={onClose}
        >
          <HiX />
        </span>

        <div className={`mx-[56px] mt-[50px] flex items-center`}>
          <div className="ml-1 mt-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
            <Logo />
          </div>
        </div>
        <div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />
        {/* Nav item */}

        <ul className="mb-auto pt-1">
          <Links routes={secondaryRoutes} />
        </ul>
      </div>
      {/* Sidebar toggle button - visible on xl screens */}
      <button
        onClick={onToggle}
        className={`fixed top-[50%] z-50 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-175 hover:bg-gray-100 dark:bg-navy-800 dark:hover:bg-navy-700 xl:flex ${
          open ? "left-[238px]" : "left-3"
        }`}
      >
        {open ? (
          <HiChevronLeft className="h-4 w-4 text-gray-600 dark:text-white" />
        ) : (
          <HiChevronRight className="h-4 w-4 text-gray-600 dark:text-white" />
        )}
      </button>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 xl:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
