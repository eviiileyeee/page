import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext/ThemeContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Bell, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  CirclePlus, 
  UserRoundPlus, 
  Home, 
  FileText, 
  Calendar, 
  Phone, 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  MapPin,
  Search,
  LogOut
} from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    setActiveTab(path === "/" ? "home" : path.substring(1));
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = {
    user: [
      { name: "Home", path: "/", icon: Home },
      { name: "My Properties", path: "/properties", icon: Building2 },
      { name: "Register Land", path: "/register-land", icon: FileText },
      { name: "Verify Land", path: "/verify-land", icon: ShieldCheck },
    ],
    government: [
      { name: "Dashboard", path: "/gov-dashboard", icon: Home },
      { name: "Land Records", path: "/land-records", icon: FileText },
      { name: "Verify Requests", path: "/verify-requests", icon: ShieldCheck },
      { name: "Map View", path: "/map-view", icon: MapPin },
    ],
    bank: [
      { name: "Dashboard", path: "/bank-dashboard", icon: Home },
      { name: "Verify Properties", path: "/verify-properties", icon: Building2 },
      { name: "Documents", path: "/documents", icon: FileText },
    ]
  };

  return (
    <nav className={`
      fixed top-0 left-0 w-full z-50 
      transition-all duration-300
      ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <MapPin className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold text-primary dark:text-white">
                LandSys
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks[user?.role || 'user'].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  flex items-center space-x-2 text-sm font-medium
                  ${activeTab === link.path.slice(1) 
                    ? 'text-primary dark:text-white' 
                    : 'text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white'}
                `}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 text-primary dark:text-white">
          <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? (
                <Sun className="h-6 w-6 text-yellow-400" />
              ) : (
                <Moon className="h-6 w-6 text-gray-700" />
              )}
            </button>
            
            {user ? (
              <>
                <button className="btn-icon text-primary dark:text-white">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="relative text-primary dark:text-white">
                  <button 
                    className="flex items-center space-x-2"
                    onClick={() => navigate("/profile")}
                  >
                    <img
                      src={user.profileImage || "https://tse3.mm.bing.net/th?id=OIP.JttmcrrQ9_XqrY60bFEfgQHaHa&pid=Api&P=0&h=180"}
                      alt="Profile"
                      className="h-8 w-8 rounded-full ring-2 ring-primary"
                    />
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-4 text-primary dark:text-white">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden btn-icon"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`
        md:hidden
        transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
        absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg
      `}>
        <div className="p-4 space-y-4 text-primary dark:text-white">
          {user && (
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <img
                src={user.profileImage || "https://tse3.mm.bing.net/th?id=OIP.JttmcrrQ9_XqrY60bFEfgQHaHa&pid=Api&P=0&h=180"}
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {user.username || "User Name"}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {user.role} Account
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1 ">
            {navLinks[user?.role || 'user'].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg"
              >
                <link.icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {!user ? (
            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link to="/login" className="btn-secondary w-full">
                Login
              </Link>
              <Link to="/register" className="btn-primary w-full">
                Register
              </Link>
            </div>
          ) : (
            <button 
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;