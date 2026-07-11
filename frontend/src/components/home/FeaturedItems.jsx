import React, { useState, useEffect } from "react";
import { Inbox, AlertCircle } from "lucide-react";
import ItemCard from "../items/ItemCard";
import SectionTitle from "../common/SectionTitle";
import EmptyState from "../common/EmptyState";
import Card from "../common/Card";
import { itemService } from "../../services/itemService";

// Premium Skeleton Card component
function SkeletonCard() {
  return (
    <div className="border border-slate-200/50 rounded-3xl p-4 bg-white/60 backdrop-blur-sm space-y-4 animate-pulse">
      <div className="aspect-[4/3] w-full bg-slate-200 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-4.5 w-2/3 bg-slate-200 rounded-lg" />
        <div className="h-3 w-1/3 bg-slate-200 rounded-lg" />
      </div>
      <div className="pt-2 flex justify-between items-center">
        <div className="h-3.5 w-1/4 bg-slate-200 rounded-lg" />
        <div className="h-9 w-1/3 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

function FeaturedItems({
  searchTerm = "",
  selectedCategory = "All",
  onRequestTrade,
  title,
  hideTitle = false,
  customItems
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If customItems is provided, bypass network fetch
    if (customItems) {
      setItems(customItems);
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetched = await itemService.getItems();
        setItems(fetched);
      } catch (err) {
        setError(err.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [customItems]);

  // Filter items based on active search terms and categories
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lookingFor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {!hideTitle && (
        <SectionTitle
          title={title || "Featured Swap Listings"}
          subtitle="Explore items listed by neighbors in your community. Initiate zero-cost trades today."
        />
      )}

      {loading ? (
        // Renders 6 skeleton cards during active load cycles
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : error ? (
        // Renders an elegant error state boundary
        <div className="max-w-md mx-auto my-10 text-center">
          <Card className="p-8 border border-red-200/50 bg-red-50/10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-650 flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Failed to Load Listings</h3>
            <p className="text-xs text-slate-500 mb-4">{error}</p>
          </Card>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onRequestTrade={onRequestTrade} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title="No Match Found"
          description="We couldn't find any items matching your filters. Try checking other categories or clearing your search query."
        />
      )}
    </section>
  );
}

export default FeaturedItems;
