import React, { lazy } from "react";

// Admin Imports (lazy loaded for code splitting)
const MainDashboard = lazy(() => import("views/admin/default"));
const Files = lazy(() => import("views/admin/files"));
const Calendar = lazy(() => import("views/admin/calendar"));
const Profile = lazy(() => import("views/admin/profile"));
const DataTables = lazy(() => import("views/admin/tables"));
const Settings = lazy(() => import("views/admin/settings"));
const Landing = lazy(() => import("views/landing"));
const Sheets = lazy(() => import("views/admin/sheets"));
const Forms = lazy(() => import("views/admin/forms"));
const Forms2 = lazy(() => import("views/admin/forms2"));
const Forms3 = lazy(() => import("views/admin/forms3"));
const Analytics = lazy(() => import("views/admin/analytics"));
const UserManagement = lazy(() => import("views/admin/users"));

// Auth Imports (lazy loaded)
const SignIn = lazy(() => import("views/auth/SignIn"));
const SignUp = lazy(() => import("views/auth/SignUp"));

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
  MdPeople,
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
    name: "Electromagnetic Flow Meters",
    layout: "/admin",
    path: "forms",
    icon: <MdCalendarMonth className="h-6 w-6" />,
    component: <Forms />,
    secondary: true,
  },
  {
    name: "V-Notch Weirs",
    layout: "/admin",
    path: "forms2",
    icon: <MdCalendarMonth className="h-6 w-6" />,
    component: <Forms2 />,
    secondary: true,
  },
  {
    name: "Flumes",
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
    name: "User Management",
    layout: "/admin",
    path: "users",
    icon: <MdPeople className="h-6 w-6" />,
    component: <UserManagement />,
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
