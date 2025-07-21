import { useTheme } from "../hooks/useTheme";
import logo from "../assets/logo_no_name_transparent.png";
import Button from "../components/Button";

import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Switch,
} from "@headlessui/react";

import {
  House,
  CircleDollarSign,
  FileChartColumnIncreasing,
  ChartCandlestick,
  Coins,
  HandCoins,
  Bitcoin,
  Weight,
  Flame,
  Sprout,
  ChartPie,
  Settings,
  ChevronDown,
  Menu as HamburgerMenu,
  X,
} from "lucide-react";

const LayoutMain = () => {
  const { loginWithRedirect, user, isAuthenticated, logout, isLoading } =
    useAuth0();
  const [enabled, setEnabled] = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const links = [
    {
      to: "/",
      label: "Dashboard",
      icon: <House size={20} strokeWidth={1.75} />,
    },
    {
      to: "/cash",
      label: "Cash",
      icon: <CircleDollarSign size={20} strokeWidth={1.75} />,
    },
    {
      to: "/etf",
      label: "ETFs",
      icon: <FileChartColumnIncreasing size={20} strokeWidth={1.75} />,
    },
    {
      to: "/stocks",
      label: "Stocks",
      icon: <ChartCandlestick size={20} strokeWidth={1.75} />,
    },
    {
      to: "/managed-funds",
      label: "Managed Funds",
      icon: <Coins size={20} strokeWidth={1.75} />,
    },
    {
      to: "/crypto",
      label: "Crypto",
      icon: <Bitcoin size={20} strokeWidth={1.75} />,
    },
    {
      to: "/dividends",
      label: "Dividends",
      icon: <HandCoins size={20} strokeWidth={1.75} />,
    },
    {
      to: "/liabilities",
      label: "Liabilities",
      icon: <Weight size={20} strokeWidth={1.75} />,
    },
    {
      to: "/fire",
      label: "FIRE",
      icon: <Flame size={20} strokeWidth={1.75} />,
    },
    {
      to: "/super",
      label: "Superannuation",
      icon: <Sprout size={20} strokeWidth={1.75} />,
    },
    {
      to: "/budget",
      label: "Budget",
      icon: <ChartPie size={20} strokeWidth={1.75} />,
    },
  ];

  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      <div
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)} // Clicking outside closes sidebar
      />

      {/* Sidebar */}
      <nav
        className={`
    fixed top-0 left-0 z-50 h-dvh bg-gray-800 text-white flex flex-col transition-transform
    w-[256px]
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    md:translate-x-0 md:fixed md:block
  `}
      >
        <div className="w-full h-full bg-gray-800 text-white flex flex-col px-4">
          {/* Logo on md and up */}
          <div className="hidden md:flex items-center justify-center mt-6 mb-4">
            <img src={logo} alt="App Logo" className="h-10 w-10 mr-2" />
            <span className="text-xl font-bold">Plexus</span>
          </div>

          {/* Close button on mobile */}
          <div className="flex justify-between items-center mt-4 md:hidden">
            <div className="text-xl font-bold">Plexus</div>
            <button
              className="text-white text-2xl"
              onClick={() => setSidebarOpen(false)}
            >
              <X strokeWidth={1.5} />
            </button>
          </div>

          {/* Sidebar links */}
          <ul className="mt-6 space-y-1 w-full">
            {links.map((link) => (
              <li key={link.to} className="w-full">
                <Link to={link.to} onClick={() => setSidebarOpen(false)}>
                  <div
                    className={`${
                      isActive(link.to) ? "bg-gray-700" : ""
                    } text-white hover:text-gray-300 hover:bg-gray-700 transition-colors duration-200 w-full py-2 px-4 rounded-xl flex items-center gap-2`}
                  >
                    {link.icon}
                    <p>{link.label}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto mb-6 text-center text-white hover:text-gray-300 hover:bg-gray-700 w-full py-2 px-4 rounded-xl">
            <Link
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-start gap-2"
            >
              <Settings size={20} strokeWidth={1.75} />
              <p>Settings</p>
            </Link>
          </div>
        </div>
      </nav>

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 md:left-[256px] right-0 z-10 px-6 py-2 border-b border-gray-200 transition-colors duration-300 bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-white">
        <div className="flex items-center justify-between md:justify-end">
          <HamburgerMenu
            strokeWidth={1.5}
            className="md:hidden cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />
          {!isLoading ? (
            !isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() =>
                    loginWithRedirect({
                      authorizationParams: {
                        screen_hint: "signup",
                      },
                    })
                  }
                >
                  Register
                </Button>
                <Button onClick={() => loginWithRedirect()}>Login</Button>
              </div>
            ) : (
              <Menu>
                <MenuButton className="flex items-center gap-2 space-x-2 rounded-xl px-3 py-1.5 shadow-inner dark:shadow-white/10 shadow-black/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-300 data-open:bg-gray-300 dark:data-hover:bg-gray-800 dark:data-open:bg-gray-800">
                  <img
                    src={user?.picture}
                    alt="User avatar"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{user?.name}</span>
                  <ChevronDown size={16} strokeWidth={1.75} />
                </MenuButton>
                <MenuItems
                  transition
                  anchor="bottom end"
                  className="z-30 w-48 origin-top-right rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-1 transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                >
                  <MenuItem>
                    <div className="flex items-center justify-between p-2">
                      <p className="dark:text-gray-100">Display Mode</p>
                      <Switch
                        checked={enabled}
                        onChange={setEnabled}
                        className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-gray-200 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-gray-800 data-focus:outline data-focus:outline-white"
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white dark:bg-gray-400 shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
                        />
                      </Switch>
                    </div>
                  </MenuItem>

                  <MenuItem className="hover:bg-gray-200 rounded-lg dark:text-gray-100 dark:hover:bg-gray-800 w-full py-1 px-2 text-start">
                    <button onClick={() => logout()}>Logout</button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            )
          ) : (
            <div className="h-10" />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[74px] h-screen overflow-auto p-6 transition-colors duration-300 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 md:ml-[256px]">
        <Outlet />
      </main>
    </>
  );
};

export default LayoutMain;
