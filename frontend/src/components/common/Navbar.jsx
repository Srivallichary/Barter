import React, { useState, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, ArrowLeftRight, UserCircle } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import Avatar from "./Avatar";
import Button from "./Button";
import ProfileDrawer from "./ProfileDrawer";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsDrawerOpen(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Explore" },
    ...(user
      ? [
          { to: "/my-items", label: "My Listings" },
          { to: "/trades", label: "Swap Board" },
          { to: "/profile", label: "Profile" },
          ...(user.role?.toLowerCase() === "admin" ? [{ to: "/admin/verification", label: "Admin Review" }] : []),
        ]
      : []),
  ];

  const getLinkClass = ({ isActive }) =>
    `relative py-2 text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors duration-250 cursor-pointer ${
      isActive
        ? "text-[#51D95F] font-extrabold"
        : "text-slate-550 hover:text-slate-900"
    }`;

  return (
    <>
      <nav className="bg-white/65 backdrop-blur-md border-b border-white/35 sticky top-0 z-40 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-[#51D95F] flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-all duration-200">
                B
              </div>
              <span className="text-base font-black text-slate-900 tracking-wider group-hover:text-[#51D95F] transition-colors uppercase">
                Barter
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex md:ml-10 md:space-x-8">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className={getLinkClass}>
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <span className="absolute bottom-[-22px] left-0 right-0 h-0.5 bg-[#51D95F] rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Desktop Right Panel */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {user ? (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-white/60 transition cursor-pointer"
              >
                <Avatar name={user.name} src={user.avatar} size="sm" />
                <span className="text-xs sm:text-sm font-bold text-slate-700 max-w-[145px] truncate uppercase tracking-widest">
                  {user.name.split(" ")[0]}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Button to="/login" variant="ghost" size="sm" className="text-xs sm:text-sm">
                  Log in
                </Button>
                <Button to="/signup" variant="primary" size="sm" className="text-xs sm:text-sm bg-[#51D95F] hover:bg-[#3fc94c]">
                  Sign up
                </Button>
              </div>
            )}
          </div>

          {/* Hamburger menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200/60 bg-white animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest ${
                    isActive
                      ? "bg-[#f1fdf2] text-[#2fa53e]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {user ? (
              <div className="pt-4 border-t border-slate-100 mt-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsDrawerOpen(true);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 w-full text-left"
                >
                  <Avatar name={user.name} src={user.avatar} size="sm" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Open Menu
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {user.email || `${user.name.toLowerCase()}@example.com`}
                    </p>
                  </div>
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100 mt-4 flex flex-col gap-2">
                <Button
                  to="/login"
                  variant="outline"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Button>
                <Button
                  to="/signup"
                  variant="primary"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      </nav>

      {/* Slide-over Profile Drawer Panel */}
      {user && (
        <ProfileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default Navbar;