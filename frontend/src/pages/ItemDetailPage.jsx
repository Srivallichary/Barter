import React, { useState, useContext, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, ShieldCheck, MapPin, User, Star, Layers, Calendar, MessageSquare, AlertCircle, Heart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/common/Layout";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Avatar from "../components/common/Avatar";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import EmptyState from "../components/common/EmptyState";
import { itemService } from "../services/itemService";
import { tradeService } from "../services/tradeService";
import { wishlistService } from "../services/wishlistService";

// Premium Skeleton Detail view
function SkeletonDetailPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-6">
      <div className="h-4 w-1/4 bg-slate-200 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="flex gap-3 justify-center">
            <div className="w-20 h-20 bg-slate-200 rounded-2xl" />
            <div className="w-20 h-20 bg-slate-200 rounded-2xl" />
            <div className="w-20 h-20 bg-slate-200 rounded-2xl" />
          </div>
        </div>
        <div className="lg:col-span-7 space-y-6">
          <div className="h-5 w-1/4 bg-slate-200 rounded-lg" />
          <div className="h-10 w-2/3 bg-slate-200 rounded-lg" />
          <div className="h-20 w-full bg-slate-200 rounded-3xl" />
          <div className="h-16 w-full bg-slate-200 rounded-3xl" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-200 rounded-lg" />
            <div className="h-4 w-5/6 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Detail states
  const [item, setItem] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery
  const [selectedPhoto, setSelectedPhoto] = useState("");

  // Trade Modal states
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [tradeMessage, setTradeMessage] = useState("");
  const [tradeSubmitting, setTradeSubmitting] = useState(false);

  useEffect(() => {
    const loadDetailData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Load item details
        const targetItem = await itemService.getItem(id);
        setItem(targetItem);
        setSelectedPhoto(targetItem.image);

        // Load wishlist items
        const savedWishlist = await wishlistService.getWishlist();
        setWishlist(savedWishlist);

        // Load user's items for swap list
        if (user) {
          const allItems = await itemService.getItems();
          const filteredUserItems = allItems.filter(i => i.owner === user.id || i.owner === user._id);
          setUserItems(filteredUserItems);
        }
      } catch (err) {
        setError(err.message || "Failed to load listing details");
      } finally {
        setLoading(false);
      }
    };

    loadDetailData();
  }, [id, user]);

  const isFavorited = wishlist.includes(id);

  // Wishlist handler toggle
  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error("Please login to save items to your wishlist!");
      navigate("/login");
      return;
    }

    try {
      if (isFavorited) {
        const updated = await wishlistService.removeWishlist(id);
        setWishlist(updated);
        toast.error("Removed from wishlist", { icon: "💔" });
      } else {
        const updated = await wishlistService.addWishlist(id);
        setWishlist(updated);
        toast.success("Saved to wishlist!", { icon: "💖" });
      }
    } catch {
      toast.error("Failed to update wishlist state");
    }
  };

  // Trade Request proposal submit handler
  const handleRequestTrade = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to request a trade");
      navigate("/login");
      return;
    }

    if (!selectedOfferId) {
      toast.error("Please select an item to offer in exchange");
      return;
    }

    const offeredItem = userItems.find(i => i._id === selectedOfferId || i.id === selectedOfferId);
    if (!offeredItem) {
      toast.error("Selected item not found");
      return;
    }

    setTradeSubmitting(true);
    try {
      const ownerId = item.owner?._id || item.owner?.id || item.owner;
      const ownerName = item.owner?.name || "Member";

      await tradeService.requestTrade({
        fromUser: user.id || user._id,
        toUser: ownerId,
        offeredItem: offeredItem._id || offeredItem.id,
        requestedItem: item._id || item.id,
        message: tradeMessage || `Hey ${ownerName}, I'd love to swap my ${offeredItem.title} for your ${item.title}!`
      });

      setIsTradeModalOpen(false);
      toast.success("Trade request sent successfully!", { icon: "📨" });

      // Redirect to swap board
      setTimeout(() => {
        navigate("/trades");
      }, 1200);
    } catch (err) {
      toast.error("Failed to submit swap request.");
    } finally {
      setTradeSubmitting(false);
    }
  };

  // Switch thumbnail gallery pictures
  const productPhotos = item ? [
    item.image,
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80",
  ] : [];

  if (loading) {
    return (
      <Layout>
        <SkeletonDetailPage />
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="max-w-md mx-auto my-20">
          <EmptyState
            icon={AlertCircle}
            title="Item Not Found"
            description={error || "The listing you're trying to view doesn't exist or was removed."}
            actionText="Back to explore"
            onActionClick={() => navigate("/")}
          />
        </div>
      </Layout>
    );
  }

  const ownerName = item.owner?.name || (typeof item.owner === "string" ? item.owner : "Member");
  const isOwner = user && (ownerName === user.name || (item.owner?._id || item.owner) === (user.id || user._id));

  return (
    <Layout>
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft size={16} />
            Back to Marketplace
          </Link>
        </div>

        {/* 2-Column Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: Product Images Gallery (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card rounded-3xl overflow-hidden aspect-square bg-slate-50/50 shadow-sm border border-white/35 relative">
              <img
                src={selectedPhoto}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              
              {/* Wishlist toggle badge */}
              {!isOwner && (
                <button
                  onClick={handleToggleFavorite}
                  className="absolute top-4 right-4 p-3.5 bg-white/80 hover:bg-white text-slate-600 hover:text-red-500 rounded-full shadow-md border border-white/20 transition cursor-pointer"
                >
                  <Heart size={20} className={isFavorited ? "fill-red-500 text-red-500" : ""} />
                </button>
              )}
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="flex gap-3 justify-center">
              {productPhotos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`
                    w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-100
                    ${selectedPhoto === photo ? "border-indigo-600 scale-95 shadow-md" : "border-slate-100 hover:border-slate-350"}
                  `}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Specifications & CTA Options (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <Badge variant="slate">{item.category}</Badge>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-955 leading-tight m-0">
                {item.title}
              </h1>
            </div>

            {/* Seeking exchange detail */}
            <div className="bg-indigo-50/40 border border-indigo-200/40 p-5 rounded-3xl flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-100/60 text-indigo-650 flex items-center justify-center shrink-0">
                <RefreshCw size={22} className="animate-spin-slow" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-indigo-750 font-extrabold uppercase tracking-widest leading-none mb-1.5">
                  Owner is seeking in trade:
                </p>
                <p className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  {item.lookingFor}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500">Description</h3>
              <p className="text-sm sm:text-base text-slate-650 font-medium leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Owner Info Profile */}
            <div className="pt-6 border-t border-slate-200/50">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Owner Profile</h3>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 border border-white/20 p-5 rounded-3xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Avatar name={ownerName} src={item.owner?.avatar || item.ownerAvatar} size="md" className="shadow-sm" />
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-905 flex items-center gap-1.5">
                      {ownerName}
                      <ShieldCheck size={16} className="text-indigo-500" />
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-450 font-semibold">
                      <span className="flex items-center gap-0.5">
                        <Star size={12} className="text-amber-500 fill-amber-500" /> 4.9 Rating
                      </span>
                      <span>•</span>
                      <span>Verified Neighbor</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200/60 py-2 px-3 rounded-2xl text-slate-500 font-bold uppercase tracking-wider select-none">
                  <MapPin size={12} className="text-slate-400" />
                  {item.location || "Local Area"}
                </div>
              </div>
            </div>

            {/* Swap Trigger Call-to-action */}
            {!isOwner && (
              <div className="pt-6">
                <Button
                  onClick={() => setIsTradeModalOpen(true)}
                  variant="primary"
                  className="w-full py-4 text-sm sm:text-base uppercase tracking-widest font-black bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/10"
                >
                  Propose Swap Deal
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Propose Swap Modal */}
      <Modal
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
        title="Propose Swap Deal"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={tradeSubmitting}
              onClick={() => setIsTradeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRequestTrade}
              isLoading={tradeSubmitting}
              disabled={!selectedOfferId}
              className="bg-indigo-650 hover:bg-indigo-700"
            >
              Send Request
            </Button>
          </>
        }
      >
        <form onSubmit={handleRequestTrade} className="space-y-5">
          <div className="bg-slate-50/50 p-4 border border-slate-200/60 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">You are requesting</span>
            <h4 className="text-sm font-black text-slate-800 mt-1 truncate">{item.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5">Listed by: {ownerName}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select One of Your Items to Offer in Exchange
            </label>
            
            {userItems.length > 0 ? (
              <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                {userItems.map((userItem) => (
                  <label
                    key={userItem.id}
                    className={`
                      flex items-center gap-3 p-3.5 border rounded-2xl cursor-pointer transition
                      hover:bg-slate-50/50
                      ${selectedOfferId === String(userItem.id) ? "border-indigo-500 bg-indigo-50/20" : "border-slate-200/80"}
                    `}
                  >
                    <input
                      type="radio"
                      name="offerItem"
                      disabled={tradeSubmitting}
                      value={userItem.id}
                      checked={selectedOfferId === String(userItem.id)}
                      onChange={(e) => setSelectedOfferId(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <img src={userItem.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs sm:text-sm font-bold text-slate-800 block truncate">{userItem.title}</span>
                      <span className="text-[10px] text-slate-400 block leading-none mt-0.5">{userItem.category}</span>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-slate-250 p-6 rounded-2xl text-center space-y-3">
                <p className="text-xs text-slate-500">
                  You don't have any items listed in your inventory. Add a listing first to make swap offers.
                </p>
                <Button to="/my-items" variant="outline" size="sm">
                  Add a Listing
                </Button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Add a Friendly Note (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Hey! Let me know if you would like to swap these..."
              value={tradeMessage}
              onChange={(e) => setTradeMessage(e.target.value)}
              disabled={tradeSubmitting}
              className="block w-full rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm text-slate-900 transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
            />
          </div>
        </form>
      </Modal>
    </Layout>
  );
}

export default ItemDetailPage;
