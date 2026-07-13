import React, { useState, useEffect } from "react";
import { Inbox, AlertCircle } from "lucide-react";
import ItemCard from "../items/ItemCard";
import SectionTitle from "../common/SectionTitle";
import EmptyState from "../common/EmptyState";
import Card from "../common/Card";
import { itemService } from "../../services/itemService";

function SkeletonCard() {
  return (
    <div className="rounded-[2rem] border border-slate-200/70 bg-white p-5 shadow-sm animate-pulse">
      <div className="aspect-[4/3] w-full rounded-3xl bg-slate-200" />
      <div className="mt-5 space-y-3">
        <div className="h-4 rounded-full bg-slate-200" />
        <div className="h-3 w-3/5 rounded-full bg-slate-200" />
      </div>
      <div className="mt-5 flex gap-3">
        <div className="h-10 w-full rounded-2xl bg-slate-200" />
        <div className="h-10 w-28 rounded-2xl bg-slate-200" />
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
  customItems,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  const filteredItems = items.filter((item) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.lookingFor.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {!hideTitle && (
        <SectionTitle
          title={title || "Featured Swap Listings"}
          subtitle="Explore nearby items and start a trade that suits your needs."
        />
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : error ? (
        <div className="max-w-md mx-auto my-10">
          <Card className="p-8 border border-red-200/50 bg-red-50/10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Unable to load items</h3>
            <p className="text-sm text-slate-500">{error}</p>
          </Card>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onRequestTrade={onRequestTrade} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Inbox}
          title="No items match your search"
          description="Clear your filters or try a broader search term to see more listings."
        />
      )}
    </section>
  );
}

export default FeaturedItems;
