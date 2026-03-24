import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiMenu3Line, RiCloseLine, RiMoonFill, RiSunFill } from "react-icons/ri";
import Logo from "./Logo";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm dark:bg-navy-900">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-brand-500 dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <RiCloseLine className="h-6 w-6" />
            ) : (
              <RiMenu3Line className="h-6 w-6" />
            )}
          </button>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-600 hover:text-brand-500 transition-colors duration-200 dark:text-white dark:hover:text-brand-400"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Login Button and Dark Mode Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-white dark:bg-navy-800 shadow-sm hover:shadow-md transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <RiSunFill className="h-5 w-5 text-yellow-500" />
              ) : (
                <RiMoonFill className="h-5 w-5 text-navy-700" />
              )}
            </button>
            <Link
              to="/auth/sign-in"
              className="rounded-lg bg-brand-500 px-6 py-2 text-white hover:bg-brand-600 transition-colors duration-200"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-navy-900 py-4">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-600 hover:text-brand-500 transition-colors duration-200 px-4 py-2 dark:text-white dark:hover:text-brand-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center space-x-4 px-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-white dark:bg-navy-800 shadow-sm hover:shadow-md transition-all duration-300"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <RiSunFill className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <RiMoonFill className="h-5 w-5 text-navy-700" />
                  )}
                </button>
                <Link
                  to="/auth/sign-in"
                  className="flex-1 rounded-lg bg-brand-500 px-6 py-2 text-white hover:bg-brand-600 transition-colors duration-200 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 