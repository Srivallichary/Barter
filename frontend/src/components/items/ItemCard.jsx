import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Heart, Star, MapPin } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Avatar from "../common/Avatar";
import Button from "../common/Button";

function ItemCard({ item, onRequestTrade }) {
  const { id, title, category, owner, ownerAvatar, image, lookingFor, description, condition, location } = item;
  const [isFavorited, setIsFavorited] = useState(false);

  const itemCondition = condition || "Good";
  const ownerLocation = location || "Nearby Area";
  const ownerRating = owner?.rating ? Number(owner.rating).toFixed(1) : "4.8";

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <Card className="flex flex-col h-full bg-white border border-slate-200/50 shadow-[0_1px_3px_rgba(0,0,0,0.01),0_6px_12px_-3px_rgba(0,0,0,0.015)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.05)] transition-all duration-300 group">
      
      {/* Product Image Panel */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Favorite Icon Toggle */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-100 text-slate-400 hover:text-red-500 hover:scale-105 transition-all shadow-sm cursor-pointer z-10"
          aria-label="Add to favorites"
        >
          <Heart 
            size={14} 
            className={`transition-colors duration-200 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} 
          />
        </button>

        {/* Condition Tag Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="slate" className="bg-white/90 border-white/20 text-slate-700 text-xs font-black shadow-sm py-1.5 px-3">
            {itemCondition}
          </Badge>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-grow space-y-3.5 bg-white/25">
        <div>
          {/* Category & Rating */}
          <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-450">
            <span>{category}</span>
            <div className="flex items-center gap-0.5 text-amber-500 font-bold">
              <Star size={12} className="fill-amber-500 text-amber-500" />
              <span>{ownerRating}</span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/items/${id}`} className="hover:text-indigo-650 transition-colors block mt-2">
            <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug line-clamp-1">
              {title}
            </h3>
          </Link>

          {/* Location placeholder */}
          <div className="flex items-center gap-1 text-xs font-bold text-slate-450 mt-1.5">
            <MapPin size={12} className="shrink-0 text-slate-400" />
            <span>{ownerLocation}</span>
          </div>
        </div>

        {/* Swap criteria card */}
        <div className="pt-3.5 border-t border-slate-200/50">
          <div className="flex items-center gap-2.5 text-xs bg-white/40 border border-white/30 p-2.5 rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
            <RefreshCw size={14} className="text-indigo-500 animate-spin-slow shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Seeking Swap</p>
              <p className="text-xs sm:text-sm font-extrabold text-slate-750 truncate mt-1 leading-none">{lookingFor}</p>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="grid grid-cols-2 gap-2.5 pt-1.5">
          <Button
            to={`/items/${id}`}
            variant="outline"
            size="sm"
            className="text-xs font-bold uppercase tracking-widest py-2"
          >
            Details
          </Button>
          <Button
            onClick={() => onRequestTrade && onRequestTrade(item)}
            variant="primary"
            size="sm"
            className="text-xs font-bold uppercase tracking-widest py-2 bg-indigo-600 hover:bg-indigo-700"
          >
            Trade
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ItemCard;