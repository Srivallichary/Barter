import React from "react";
import { Link } from "react-router-dom";
import { Globe, Share2, MessageSquare, Heart } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/40 border-t border-white/35 backdrop-blur-sm mt-24">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo / Description */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-650 flex items-center justify-center text-white font-bold text-base shadow-sm">
                B
              </div>
              <span className="text-base font-extrabold text-slate-900 tracking-wider uppercase">
                Barter
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Exchanging goods locally with your neighbors and community. No money, no hassle, just sustainable sharing.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-indigo-650 transition-colors" aria-label="Web">
                <Globe size={16} />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-650 transition-colors" aria-label="Share">
                <Share2 size={16} />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-650 transition-colors" aria-label="Chat">
                <MessageSquare size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Marketplace
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-xs font-medium text-slate-600 hover:text-indigo-650 transition-colors">
                  Explore Items
                </Link>
              </li>
              <li>
                <Link to="/my-items" className="text-xs font-medium text-slate-600 hover:text-indigo-650 transition-colors">
                  My Listings
                </Link>
              </li>
              <li>
                <Link to="/trades" className="text-xs font-medium text-slate-600 hover:text-indigo-650 transition-colors">
                  Trade Board
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="#" className="text-xs font-medium text-slate-600 hover:text-indigo-650 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-xs font-medium text-slate-600 hover:text-indigo-650 transition-colors">
                  Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-xs font-medium text-slate-600 hover:text-indigo-650 transition-colors">
                  Safety Tips
                </a>
              </li>
            </ul>
          </div>

          {/* Community Info */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
              Community Project
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Developed for local peer-to-peer bartering. Supports sustainability, eco-friendly sharing, and neighborhood community recycling initiatives.
            </p>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-[10px] text-slate-450">
            &copy; {currentYear} Barter. Built as a sustainable community initiative.
          </p>
          <p className="text-[10px] text-slate-450 flex items-center gap-1">
            Made with <Heart size={10} className="text-red-500 fill-red-500" /> for the community.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;