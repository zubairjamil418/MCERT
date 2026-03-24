import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import Files from "views/admin/files";
import Calendar from "views/admin/calendar";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import Settings from "views/admin/settings";
import Landing from "views/landing";
import Sheets from "views/admin/sheets";
import Forms from "views/admin/forms";
import Forms2 from "views/admin/forms2";
import Forms3 from "views/admin/forms3";
import Analytics from "views/admin/analytics";

// Auth Imports
import SignIn from "views/auth/SignIn";
import SignUp from "views/auth/SignUp";

// Icon Imports
import {
  MdHome,
  MdBarChart,
  MdPerson,
  MdLock,
  MdSettings,
  MdAttachFile,
  MdCalendarMonth,
  MdInsights,
} from "react-icons/md";

const routes = [
  {
    name: "Landing",
    layout: "/",
    path: "",
    component: <Landing />,
    secondary: true,
  },
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
    secondary: true,
  },
  {
    name: "Analytics",
    layout: "/admin",
    path: "analytics",
    icon: <MdInsights className="h-6 w-6" />,
    component: <Analytics />,
    secondary: true,
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
    secondary: true,
  },
  {
    name: "Files",
    layout: "/admin",
    path: "files",
    icon: <MdAttachFile className="h-6 w-6" />,
    component: <Files />,
    secondary: true,
  },
  {
    name: "Calendar",
    layout: "/admin",
    path: "calendar",
    icon: <MdCalendarMonth className="h-6 w-6" />,
    component: <Calendar />,
    secondary: true,
  },
  {
    name: "Forms",
    layout: "/admin",
    path: "forms",
    icon: <MdCalendarMonth className="h-6 w-6" />,
    component: <Forms />,
    secondary: true,
  },
  {
    name: "Forms 2",
    layout: "/admin",
    path: "forms2",
    icon: <MdCalendarMonth className="h-6 w-6" />,
    component: <Forms2 />,
    secondary: true,
  },
  {
    name: "Forms 3",
    layout: "/admin",
    path: "forms3",
    icon: <MdCalendarMonth className="h-6 w-6" />,
    component: <Forms3 />,
    secondary: true,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
    secondary: true,
  },
  {
    name: "Sheets",
    layout: "/admin",
    path: "sheets",
    icon: <MdSettings className="h-6 w-6" />,
    component: <Sheets />,
    secondary: false,
  },
  {
    name: "Settings",
    layout: "/admin",
    path: "settings",
    icon: <MdSettings className="h-6 w-6" />,
    component: <Settings />,
    secondary: true,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
    secondary: false,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignUp />,
    secondary: false,
  },
];
export default routes;
