import { Link, Outlet, useLocation } from "react-router";
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
} from "lucide-react";

const Sidebar = () => {
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
      {/* Fixed Sidebar */}
      <nav className="fixed top-0 left-0 w-[256px] h-dvh bg-gray-800 text-white flex flex-col">
        <div className="w-full h-full bg-gray-800 text-white flex flex-col px-4">
          <div className="text-xl font-bold mt-4">My App</div>
          <ul className="mt-6 space-y-1 w-full">
            {links.map((link) => (
              <li key={link.to} className="w-full">
                <Link to={link.to}>
                  <div
                    className={`${
                      isActive(link.to) ? "bg-gray-700" : ""
                    } text-white hover:text-gray-300 hover:bg-gray-700 w-full py-2 px-4 rounded-xl flex items-center gap-2`}
                  >
                    {link.icon}
                    <p>{link.label}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto mb-4 text-center flex items-center justify-start gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <img
                src="https://via.placeholder.com/40"
                alt="User"
                className="w-full h-full rounded-full"
              />
            </div>
            <p>Tim Cook</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="ml-[256px] h-screen overflow-auto p-6">
        <Outlet />
      </main>
    </>
  );
};

export default Sidebar;
