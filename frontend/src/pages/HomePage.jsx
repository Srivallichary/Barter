import React, { useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/common/Layout";
import Hero from "../components/home/Hero";
import SearchBar from "../components/home/SearchBar";
import CategoryFilter from "../components/home/CategoryFilter";
import FeaturedItems from "../components/home/FeaturedItems";
import HowItWorks from "../components/home/HowItWorks";
import Button from "../components/common/Button";

function HomePage() {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleRequestTrade = (item) => {
    if (!user) {
      toast.error("Please login to request a trade swap!");
      setTimeout(() => navigate("/login"), 700);
      return;
    }
    navigate(`/items/${item.id}`);
  };

  return (
    <Layout>
      <Toaster position="top-right" reverseOrder={false} />
      <Hero />

      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr] items-start">
            <div className="rounded-[2rem] border border-slate-200/70 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.08)] p-8">
              <div className="flex flex-col gap-4">
                <div className="max-w-xl">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">Browse and swap in your community</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Find quality items, trade safely, and finish swaps without cash.</h2>
                  <p className="mt-5 text-slate-500 leading-8">Search listings from nearby members, compare swap offers, and manage trades securely from one dashboard.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200/70">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Quick access</p>
                    <p className="mt-3 text-xl font-black text-slate-900">Instant listing search</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200/70">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Transparent</p>
                    <p className="mt-3 text-xl font-black text-slate-900">Swap history visibility</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200/70">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Local</p>
                    <p className="mt-3 text-xl font-black text-slate-900">Neighborhood-first offers</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]">
                  <SearchBar value={searchTerm} onChange={handleSearchChange} />
                  <Button to="/signup" variant="primary" size="lg" className="w-full sm:w-auto">
                    Join and swap
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] overflow-hidden shadow-[0_25px_75px_rgba(15,23,42,0.1)]">
                <img
                  src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80"
                  alt="Community exchange"
                  className="w-full h-full object-cover min-h-[420px]"
                />
              </div>
              <div className="rounded-[2rem] border border-slate-200/70 bg-white p-7 shadow-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">Community tip</p>
                <p className="text-sm text-slate-500 leading-7">Propose safe meetups with clear item descriptions and always choose a public location near both members.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">Featured swaps</p>
              <h2 className="text-3xl font-black text-slate-900">Top items ready to trade</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button to="/trades" variant="outline" size="sm">Swap board</Button>
              <Button to="/my-items" variant="secondary" size="sm">My listings</Button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50 shadow-[0_20px_70px_rgba(15,23,42,0.08)] p-6">
            <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
            <FeaturedItems
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onRequestTrade={handleRequestTrade}
              hideTitle={true}
              excludeUserId={user?.id || user?._id}
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr] items-start">
            <div className="space-y-8">
              <div className="rounded-[2rem] border border-slate-200/70 bg-white p-12 shadow-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">Why Barter</p>
                <h2 className="text-3xl font-black text-slate-900">A better swap marketplace for local communities</h2>
                <p className="mt-5 text-slate-500 leading-8">Barter makes it easy to list items, receive offers, and complete swaps without cash. The platform is built to keep trade communication clear, safe, and centered on real people.</p>
              </div>
              <HowItWorks />
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-indigo-50 via-white to-slate-100 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.1)]">
              <div className="space-y-5">
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/70">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Community metrics</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Active members", value: "5.3K+" },
                      { label: "Local listings", value: "1.2K+" },
                      { label: "Completed swaps", value: "850+" },
                      { label: "Trust rating", value: "4.8?" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 text-center">
                        <p className="text-2xl font-black text-slate-900">{item.value}</p>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.35em] text-slate-400">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/70">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400 mb-3">Guide</p>
                  <h3 className="text-xl font-black text-slate-900">Start your first swap with confidence</h3>
                  <p className="mt-3 text-slate-500 leading-7">Create a clear listing, choose a safe public meetup, and confirm the swap when both items are inspected.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default HomePage;
