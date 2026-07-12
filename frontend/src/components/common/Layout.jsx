import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children, className = "" }) {
  return (
    <div className="min-h-screen bg-slate-50/20 flex flex-col font-sans antialiased">
      <Navbar />

      <main className={`flex-grow animate-in fade-in duration-300 ${className}`}>
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default Layout;