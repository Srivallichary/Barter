import React, { useState, useContext, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeftRight, Sparkles } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/common/Layout";
import Hero from "../components/home/Hero";
import SearchBar from "../components/home/SearchBar";
import CategoryFilter from "../components/home/CategoryFilter";
import FeaturedItems from "../components/home/FeaturedItems";
import HowItWorks from "../components/home/HowItWorks";
import Button from "../components/common/Button";
import SectionTitle from "../components/common/SectionTitle";
import { itemService } from "../services/itemService";

function HomePage() {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllItems = async () => {
      setItemsLoading(true);
      try {
        const fetched = await itemService.getItems();
        setItems(fetched);
      } catch {
        // Fail silently
      } finally {
        setItemsLoading(false);
      }
    };
    fetchAllItems();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleRequestTrade = (item) => {
    if (!user) {
      toast.error("Please login to request a trade swap!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
    toast.success(`Opening swap details for: ${item.title}...`, {
      icon: "🔄",
      duration: 2000,
    });
    setTimeout(() => {
      navigate(`/items/${item.id}`);
    }, 500);
  };

  // Slice items for distinct homepage lists in guest view
  const featuredList = itemsLoading ? null : items.slice(0, 6);
  const recentlyAddedList = itemsLoading ? null : items.slice(6, 12);

  return (
    <Layout>
      <Toaster position="top-right" reverseOrder={false} />
      
      {user ? (
        /* Logged In Explore Dashboard Header */
        <div className="glass-panel border-b border-white/35 py-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight m-0">
                Welcome back, {user.name}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-extrabold uppercase tracking-widest">
                Explore listings and trade items near <span className="text-indigo-650 font-black">{user.department || "your area"}</span>.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button to="/my-items" variant="outline" size="sm" icon={Plus}>
                Add Listing
              </Button>
              <Button to="/trades" variant="secondary" size="sm" icon={ArrowLeftRight}>
                Swap Board
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Guest Hero Header */
        <Hero />
      )}

      {/* Main Content Layout */}
      {user ? (
        /* Logged In Full-Width Explore Feed */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div className="glass-panel p-6 rounded-3xl border border-white/35 shadow-sm space-y-5">
            <SearchBar 
              value={searchTerm} 
              onChange={handleSearchChange} 
              className="px-0"
            />
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategorySelect} 
            />
          </div>

          <div className="glass-panel rounded-3xl border border-white/35 shadow-sm p-6">
            <FeaturedItems 
              searchTerm={searchTerm} 
              selectedCategory={selectedCategory} 
              onRequestTrade={handleRequestTrade}
              hideTitle={true}
            />
          </div>
        </div>
      ) : (
        /* Guest Landing Page Flow */
        <div className="space-y-12 py-10">
          {/* Search & Categories */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 glass-panel p-6 rounded-3xl border border-white/35 shadow-sm space-y-5">
            <SearchBar 
              value={searchTerm} 
              onChange={handleSearchChange} 
            />
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategorySelect} 
            />
          </div>

          {/* Featured Items Grid (1-6) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 glass-panel rounded-3xl border border-white/35 shadow-sm p-6">
            <FeaturedItems 
              searchTerm={searchTerm} 
              selectedCategory={selectedCategory} 
              onRequestTrade={handleRequestTrade}
              customItems={featuredList}
              title="Featured Swap Listings"
            />
          </div>

          {/* Recently Added Items Grid (7-12) */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 glass-panel rounded-3xl border border-white/35 shadow-sm p-6">
            <FeaturedItems 
              searchTerm={searchTerm} 
              selectedCategory={selectedCategory} 
              onRequestTrade={handleRequestTrade}
              customItems={recentlyAddedList}
              title="Recently Added Swaps"
            />
          </div>

          {/* How It Works */}
          <HowItWorks />
        </div>
      )}
    </Layout>
  );
}

export default HomePage;