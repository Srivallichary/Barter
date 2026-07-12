import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, User, FolderHeart, ArrowLeftRight, Settings, LogOut, 
  Star, Heart, MessageSquare, Bell, Sparkles, MapPin 
} from "lucide-react";
import Avatar from "./Avatar";
import Badge from "./Badge";
import { wishlistService } from "../../services/wishlistService";
import { itemService } from "../../services/itemService";

function ProfileDrawer({ isOpen, onClose, user, onLogout }) {
  const drawerRef = useRef(null);
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Fetch wishlist statefully when the drawer opens
  useEffect(() => {
    if (!isOpen || !user) return;
    const fetchWishlist = async () => {
      try {
        const ids = await wishlistService.getWishlist();
        const all = await itemService.getItems();
        const matched = all.filter((item) => ids.includes(item.id));
        setWishlistItems(matched);
      } catch {
        // Fail silently
      }
    };
    fetchWishlist();
  }, [isOpen, user]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNavClick = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/15 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Glassmorphic Drawer container */}
        <div 
          ref={drawerRef}
          className="w-screen max-w-md glass-drawer shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-350 ease-out"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5.5 border-b border-white/20 bg-white/20">
            <h2 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-widest">Account Overview</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white/50 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Contents */}
          <div className="flex-1 overflow-y-auto px-6 py-6.5 space-y-7">
            
            {/* User Profile details */}
            <div className="text-center pb-6 border-b border-slate-200/50 flex flex-col items-center">
              <Avatar name={user.name} src={user.avatar} size="xl" className="shadow-sm" />
              <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-4 leading-tight">{user.name}</h3>
              <p className="text-xs sm:text-sm text-slate-450 mt-1 font-medium">{user.email || `${user.name.toLowerCase()}@example.com`}</p>
              
              <div className="flex items-center gap-1.5 mt-2 text-xs sm:text-sm text-slate-500 font-semibold">
                <MapPin size={14} className="text-slate-400" />
                <span>{user.department || "Location Area"}</span>
              </div>

              {/* Statistics row */}
              <div className="grid grid-cols-3 gap-3 w-full mt-6 bg-white/40 p-4 rounded-2xl border border-white/30 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Swaps</p>
                  <p className="text-base font-black text-slate-850 mt-0.5">{user.tradesCompleted || 12}</p>
                </div>
                <div className="text-center border-x border-slate-300/40">
                  <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Rating</p>
                  <p className="text-base font-black text-slate-850 flex items-center justify-center gap-0.5 mt-0.5">
                    {user.rating || 4.8} <Star size={12} className="text-amber-500 fill-amber-500" />
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Active</p>
                  <p className="text-base font-black text-slate-850 mt-0.5">2 Items</p>
                </div>
              </div>
            </div>

            {/* Quick Links Menu */}
            <div className="space-y-2">
              <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Menu</h4>
              
              <button 
                onClick={() => handleNavClick("/")}
                className="flex items-center gap-3 w-full text-left px-3.5 py-3 rounded-2xl text-sm sm:text-base font-bold text-slate-650 hover:bg-white hover:text-indigo-600 transition-all cursor-pointer shadow-sm border border-transparent hover:border-white/40"
              >
                <Sparkles size={18} className="text-slate-400" />
                Explore Dashboard
              </button>

              <button 
                onClick={() => handleNavClick("/my-items")}
                className="flex items-center gap-3 w-full text-left px-3.5 py-3 rounded-2xl text-sm sm:text-base font-bold text-slate-650 hover:bg-white hover:text-indigo-600 transition-all cursor-pointer shadow-sm border border-transparent hover:border-white/40"
              >
                <FolderHeart size={18} className="text-slate-400" />
                My Listings
              </button>

              <button 
                onClick={() => handleNavClick("/trades")}
                className="flex items-center gap-3 w-full text-left px-3.5 py-3 rounded-2xl text-sm sm:text-base font-bold text-slate-650 hover:bg-white hover:text-indigo-600 transition-all cursor-pointer shadow-sm border border-transparent hover:border-white/40"
              >
                <ArrowLeftRight size={18} className="text-slate-400" />
                Trades Hub
              </button>

              <button 
                onClick={() => handleNavClick("/profile")}
                className="flex items-center gap-3 w-full text-left px-3.5 py-3 rounded-2xl text-sm sm:text-base font-bold text-slate-650 hover:bg-white hover:text-indigo-600 transition-all cursor-pointer shadow-sm border border-transparent hover:border-white/40"
              >
                <User size={18} className="text-slate-400" />
                Edit Profile Info
              </button>
            </div>

            {/* Wishlist / Saved items */}
            <div className="space-y-3.5 pt-4 border-t border-slate-200/50">
              <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Heart size={12} className="text-slate-400" />
                Saved Wishlist ({wishlistItems.length})
              </h4>
              <div className="space-y-2">
                {wishlistItems.length > 0 ? (
                  wishlistItems.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleNavClick(`/items/${item.id}`)}
                      className="flex justify-between items-center p-3.5 rounded-2xl border border-white/30 bg-white/40 hover:bg-white cursor-pointer transition shadow-sm hover:-translate-y-0.5"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-805 leading-none">{item.title}</span>
                      <Badge variant="slate" size="sm">{item.category}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 font-medium px-2 py-1 select-none">No saved items.</p>
                )}
              </div>
            </div>

            {/* Placeholders for notifications / messages */}
            <div className="grid grid-cols-2 gap-3.5 pt-4 border-t border-slate-200/50">
              <div className="p-3.5 bg-white/30 border border-white/20 rounded-2xl text-center backdrop-blur-sm">
                <MessageSquare size={18} className="mx-auto text-slate-400 mb-1" />
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Messages</p>
                <p className="text-xs text-slate-400 mt-0.5">No new alerts</p>
              </div>
              <div className="p-3.5 bg-white/30 border border-white/20 rounded-2xl text-center backdrop-blur-sm">
                <Bell size={18} className="mx-auto text-slate-400 mb-1" />
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Notifications</p>
                <p className="text-xs text-slate-400 mt-0.5">Zero flags</p>
              </div>
            </div>

          </div>

          {/* Bottom Action Tray */}
          <div className="px-6 py-5.5 border-t border-white/20 bg-white/20 flex items-center justify-between">
            <button 
              onClick={() => handleNavClick("/profile")}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 transition cursor-pointer"
            >
              <Settings size={16} />
              Settings
            </button>
            <button 
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="flex items-center gap-2 text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50/50 px-3.5 py-2.5 rounded-xl transition cursor-pointer"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDrawer;
