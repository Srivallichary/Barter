import api from "./api";

export const tradeService = {
  // ──────────────────────────────────────────────
  // REAL API: GET /api/trades
  // Returns all trades for the authenticated user, mapped for UI
  // ──────────────────────────────────────────────
  getTrades: async () => {
    const res = await api.get("/trades");
    const list = res.data.trades || res.data || [];
    
    // Read current user
    const cachedUser = JSON.parse(localStorage.getItem("barter_user") || "{}");
    const currentUserId = cachedUser.id || cachedUser._id;

    return list.map((t) => {
      const isOutgoing = t.fromUser?._id === currentUserId || t.fromUser === currentUserId;
      
      // Capitalize status for frontend UI mapping
      let mappedStatus = "Pending";
      if (t.status === "accepted") mappedStatus = "Accepted";
      if (t.status === "rejected") mappedStatus = "Rejected";
      if (t.status === "cancelled") mappedStatus = "Cancelled";
      if (t.status === "completed") mappedStatus = "Completed";
      if (t.status === "expired") mappedStatus = "Expired";

      return {
        id: t._id,
        isOutgoing,
        status: mappedStatus,
        senderName: t.fromUser?.name || "Unknown",
        senderAvatar: t.fromUser?.avatar || "",
        receiverName: t.toUser?.name || "Unknown",
        date: new Date(t.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        senderItem: t.offeredItem?.title || "Offered Item",
        senderItemImage: t.offeredItem?.image || "",
        receiverItem: t.requestedItem?.title || "Requested Item",
        receiverItemImage: t.requestedItem?.image || "",
        message: t.message || "",
        meetupLocation: t.meetupLocation || "",
        meetupTime: t.meetupTime || "",
        messages: t.messages || []
      };
    });
  },

  // ──────────────────────────────────────────────
  // REAL API: POST /api/trades
  // Creates a new trade request
  // ──────────────────────────────────────────────
  requestTrade: async (tradeData) => {
    const res = await api.post("/trades", tradeData);
    return res.data.trade || res.data;
  },

  // ──────────────────────────────────────────────
  // REAL API: PUT /api/trades/:id/accept
  // Accepts an incoming trade request with meetup details
  // ──────────────────────────────────────────────
  acceptTrade: async (id, meetupLocation, meetupTime) => {
    const res = await api.put(`/trades/${id}/accept`, { meetupLocation, meetupTime });
    return res.data.trade || res.data;
  },

  // ──────────────────────────────────────────────
  // REAL API: PUT /api/trades/:id/reject
  // Rejects an incoming trade request
  // ──────────────────────────────────────────────
  rejectTrade: async (id) => {
    const res = await api.put(`/trades/${id}/reject`);
    return res.data.trade || res.data;
  },

  // ──────────────────────────────────────────────
  // REAL API: PUT /api/trades/:id/complete
  // Marks a trade as completed
  // ──────────────────────────────────────────────
  completeTrade: async (id) => {
    const res = await api.put(`/trades/${id}/complete`);
    return res.data.trade || res.data;
  },

  // ──────────────────────────────────────────────
  // REAL API: POST /api/trades/:id/message
  // Appends a new message to the trade chat
  // ──────────────────────────────────────────────
  sendTradeMessage: async (id, text) => {
    const res = await api.post(`/trades/${id}/message`, { text });
    return res.data.messages || [];
  },

  // ──────────────────────────────────────────────
  // PLACEHOLDER: Cancel Trade (backend not ready)
  // ──────────────────────────────────────────────
  cancelTrade: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  },
};

export default tradeService;
