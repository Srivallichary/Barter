import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, Check, X, Calendar, MapPin, MessageSquare, RefreshCw, AlertCircle, Inbox, HelpCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/common/Layout";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";
import Avatar from "../components/common/Avatar";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import { tradeService } from "../services/tradeService";

// Premium Skeleton Trade Card component
function SkeletonTradeCard() {
  return (
    <div className="border border-slate-200/50 rounded-3xl p-6 bg-white/60 backdrop-blur-sm space-y-5 animate-pulse min-h-[220px]">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4.5 w-32 bg-slate-200 rounded-lg" />
            <div className="h-3 w-16 bg-slate-200 rounded-lg" />
          </div>
        </div>
        <div className="h-6 w-16 bg-slate-200 rounded-lg" />
      </div>
      <div className="grid grid-cols-7 gap-4 items-center">
        <div className="col-span-3 h-16 bg-slate-200 rounded-2xl" />
        <div className="col-span-1 h-6 w-6 bg-slate-200 rounded-full mx-auto" />
        <div className="col-span-3 h-16 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );
}

function TradesPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Track trades list inside local state (hydrated by service)
  const [trades, setTrades] = useState([]);
  const [activeTab, setActiveTab] = useState("incoming"); // "incoming" | "outgoing"
  const [statusFilter, setStatusFilter] = useState("All"); // "All" | "Pending" | "Accepted" | "Rejected"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Chat/Messaging States
  const [activeChatTradeId, setActiveChatTradeId] = useState(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [messageSending, setMessageSending] = useState(false);

  const fetchTradesList = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await tradeService.getTrades();
      setTrades(list);
    } catch (err) {
      setError(err.message || "Failed to load trades list");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchTradesList();
    }
  }, [user]);

  // Real-time simulated polling (every 5 seconds)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const list = await tradeService.getTrades();
        setTrades(list);
      } catch (err) {
        // fail silently during background polling
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  // Send message handler
  const handleSendMessage = async (e, tradeId) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    setMessageSending(true);
    try {
      const updatedMessages = await tradeService.sendTradeMessage(tradeId, typedMessage.trim());
      setTrades(
        trades.map((t) =>
          t.id === tradeId ? { ...t, messages: updatedMessages } : t
        )
      );
      setTypedMessage("");
    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setMessageSending(false);
    }
  };

  // Auth lock screen
  if (!user) {
    return (
      <Layout>
        <div className="max-w-md mx-auto my-20 px-4">
          <Card className="p-8 text-center border border-slate-200/60 shadow-xl flex flex-col items-center bg-white" hoverable={false}>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
              <AlertCircle size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Login Required</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              To view incoming trade requests or review offers you sent to other community members, you must log in.
            </p>
            <Button to="/login" variant="primary" className="w-full bg-indigo-650 hover:bg-indigo-700">
              Sign In Now
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  // Handle Accept proposal
  const handleAcceptTrade = async (tradeId, senderName) => {
    try {
      setLoading(true);
      await tradeService.acceptTrade(
        tradeId,
        "Public Library - Ground Floor Lounge",
        "Wednesday at 2:00 PM (Suggested)"
      );
      toast.success(`Swap request accepted! Coordinate with ${senderName}.`, {
        icon: "🤝",
      });
      await fetchTradesList();
    } catch (err) {
      toast.error("Failed to accept trade request.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Reject proposal
  const handleRejectTrade = async (tradeId, senderName) => {
    try {
      setLoading(true);
      await tradeService.rejectTrade(tradeId);
      toast.error(`Swap request rejected from ${senderName}.`);
      await fetchTradesList();
    } catch (err) {
      toast.error("Failed to decline trade request.");
    } finally {
      setLoading(false);
    }
  };

  // Filter list
  const filteredTrades = trades.filter((t) => {
    // Tab filter
    const matchesTab = activeTab === "outgoing" ? t.isOutgoing : !t.isOutgoing;
    // Status filter
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesTab && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge variant="yellow">Pending</Badge>;
      case "Accepted":
        return <Badge variant="success">Accepted</Badge>;
      case "Rejected":
        return <Badge variant="red">Declined</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-slate-200/60 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight m-0">
            Swap Board
          </h1>
          <p className="mt-1.5 text-xs font-semibold text-slate-405 uppercase tracking-wider">
            Manage incoming barter offerings and review requests you proposed.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab("incoming")}
            disabled={loading}
            className={`
              flex-1 pb-4 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer disabled:opacity-50
              ${
                activeTab === "incoming"
                  ? "border-indigo-600 text-indigo-650"
                  : "border-transparent text-slate-550 hover:text-slate-900 hover:border-slate-300"
              }
            `}
          >
            Incoming Offers ({trades.filter((t) => !t.isOutgoing).length})
          </button>
          <button
            onClick={() => setActiveTab("outgoing")}
            disabled={loading}
            className={`
              flex-1 pb-4 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer disabled:opacity-50
              ${
                activeTab === "outgoing"
                  ? "border-indigo-600 text-indigo-650"
                  : "border-transparent text-slate-550 hover:text-slate-900 hover:border-slate-300"
              }
            `}
          >
            Outgoing Requests ({trades.filter((t) => t.isOutgoing).length})
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["All", "Pending", "Accepted", "Rejected"].map((status) => (
            <button
              key={status}
              disabled={loading}
              onClick={() => setStatusFilter(status)}
              className={`
                px-4 py-1.5 text-xs font-semibold rounded-lg border whitespace-nowrap cursor-pointer transition disabled:opacity-50
                ${
                  statusFilter === status
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }
              `}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Trades Cards Grid */}
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonTradeCard key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto text-center py-10">
            <Card className="p-8 border border-red-200/50 bg-red-50/10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-650 flex items-center justify-center mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Failed to Load Trades</h3>
              <p className="text-xs text-slate-500 mb-4">{error}</p>
            </Card>
          </div>
        ) : filteredTrades.length > 0 ? (
          <div className="space-y-6">
            {filteredTrades.map((trade) => {
              const partnerName = trade.isOutgoing ? trade.receiverName : trade.senderName;
              const partnerAvatar = trade.isOutgoing ? "" : trade.senderAvatar;

              return (
                <Card
                  key={trade.id}
                  className="glass-card p-6 shadow-sm hover:shadow-md transition border border-white/35"
                  hoverable={false}
                >
                  {/* Card Header Info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-200/50">
                    <div className="flex items-center gap-3.5">
                      <Avatar name={partnerName} src={partnerAvatar} size="md" />
                      <div>
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-805 leading-none">
                          {partnerName}
                        </h4>
                        <p className="text-xs sm:text-sm font-semibold text-slate-450 mt-1.5">Proposed {trade.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveChatTradeId(activeChatTradeId === trade.id ? null : trade.id)}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider transition cursor-pointer
                          ${
                            activeChatTradeId === trade.id
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                              : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-350"
                          }
                        `}
                      >
                        <MessageSquare size={13} />
                        Chat ({trade.messages?.length || 0})
                      </button>
                      {getStatusBadge(trade.status)}
                    </div>
                  </div>

                  {/* Side-by-Side Swap Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-6 items-center py-6">
                    {/* Item A */}
                    <div className="md:col-span-3 flex items-center gap-3.5 bg-white/45 p-3.5 rounded-2xl border border-white/30">
                      <img
                        src={trade.senderItemImage}
                        alt=""
                        className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] sm:text-xs text-slate-400 font-extrabold uppercase tracking-widest leading-none">
                          {trade.isOutgoing ? "Your Offer" : "Their Offer"}
                        </p>
                        <h5 className="text-xs sm:text-sm font-black text-slate-805 truncate mt-1 leading-none">
                          {trade.senderItem}
                        </h5>
                      </div>
                    </div>

                    {/* Transfer Icon */}
                    <div className="md:col-span-1 flex justify-center">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200/30 flex items-center justify-center text-indigo-600 shadow-sm animate-pulse">
                        <ArrowLeftRight size={18} />
                      </div>
                    </div>

                    {/* Item B */}
                    <div className="md:col-span-3 flex items-center gap-3.5 bg-white/45 p-3.5 rounded-2xl border border-white/30">
                      <img
                        src={trade.receiverItemImage}
                        alt=""
                        className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] sm:text-xs text-slate-400 font-extrabold uppercase tracking-widest leading-none">
                          {trade.isOutgoing ? "Seeking Item" : "Your Listing"}
                        </p>
                        <h5 className="text-xs sm:text-sm font-black text-slate-805 truncate mt-1 leading-none">
                          {trade.receiverItem}
                        </h5>
                      </div>
                    </div>
                  </div>

                  {/* Proposal notes message */}
                  {trade.message && (
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 flex items-start gap-3">
                      <MessageSquare size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[9px] text-slate-405 font-bold uppercase tracking-widest leading-none block">Message Note</span>
                        <p className="text-xs sm:text-sm font-medium text-slate-650 mt-1 leading-normal">"{trade.message}"</p>
                      </div>
                    </div>
                  )}

                  {/* Meetup Coordination Box */}
                  {trade.status === "Accepted" && trade.meetupLocation && (
                    <div className="mt-4 bg-emerald-50/30 border border-emerald-250/20 p-4.5 rounded-2xl space-y-2.5">
                      <h5 className="text-xs font-black text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                        <Calendar size={14} /> Meetup Details
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2 font-semibold text-slate-700">
                          <MapPin size={14} className="text-emerald-600" />
                          <span>{trade.meetupLocation}</span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-slate-700">
                          <Calendar size={14} className="text-emerald-600" />
                          <span>{trade.meetupTime}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chat Message Box Option */}
                  {activeChatTradeId === trade.id && (
                    <div className="mt-5 pt-5 border-t border-slate-100 space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="text-xs font-bold text-slate-805 uppercase tracking-wider flex items-center gap-1.5 m-0">
                          <MessageSquare size={14} className="text-indigo-650" />
                          Chat Conversation
                        </h5>
                        <span className="text-[10px] text-slate-400 font-semibold">Simulated Real-time</span>
                      </div>

                      {/* Chat Messages Feed Container */}
                      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col">
                        {trade.messages && trade.messages.length > 0 ? (
                          trade.messages.map((msg, msgIdx) => {
                            const isMe = msg.sender === user.id || msg.sender === user._id;
                            return (
                              <div key={msgIdx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                <div className={`
                                  max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed
                                  ${isMe 
                                    ? "bg-indigo-650 text-white rounded-tr-none shadow-sm shadow-indigo-500/10" 
                                    : "bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                                  }
                                `}>
                                  <p className="m-0 break-words">{msg.text}</p>
                                </div>
                                <span className="text-[9px] text-slate-400 mt-1 font-semibold">
                                  {isMe ? "You" : msg.senderName} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-center text-xs text-slate-400 py-6 font-semibold m-0">
                            No messages yet. Send a note below to coordinate meetup times!
                          </p>
                        )}
                      </div>

                      {/* Message Input Panel */}
                      <form onSubmit={(e) => handleSendMessage(e, trade.id)} className="flex gap-2 m-0">
                        <input
                          type="text"
                          value={typedMessage}
                          onChange={(e) => setTypedMessage(e.target.value)}
                          placeholder="Type a message to coordinate meetup details..."
                          disabled={messageSending}
                          className="flex-1 bg-white border border-slate-250 text-xs px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-650 transition"
                        />
                        <button
                          type="submit"
                          disabled={messageSending || !typedMessage.trim()}
                          className="px-5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition cursor-pointer shadow-sm disabled:opacity-50"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Pending Decision triggers */}
                  {!trade.isOutgoing && trade.status === "Pending" && (
                    <div className="flex justify-end gap-2.5 mt-5 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => handleRejectTrade(trade.id, trade.senderName)}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-4.5 py-2.5 border border-slate-250 text-slate-600 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer disabled:opacity-50"
                      >
                        <X size={14} /> Decline
                      </button>
                      <button
                        onClick={() => handleAcceptTrade(trade.id, trade.senderName)}
                        disabled={loading}
                        className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        <Check size={14} /> Accept Swap
                      </button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title={activeTab === "incoming" ? "No Incoming Swap Offers" : "No Outgoing Trade Requests"}
            description={
              activeTab === "incoming"
                ? "Other members haven't proposed swaps for your listings yet. Share your listings to get swapping!"
                : "You haven't requested swaps for other listings yet. Explore the dashboard feed to start swaps!"
            }
            actionText="Explore Listings"
            onActionClick={() => navigate("/")}
            actionIcon={HelpCircle}
          />
        )}
      </div>
    </Layout>
  );
}

export default TradesPage;
