import api from "./api";
import { normalizeImageUrl } from "../utils/helpers";

const mapItem = (item) => {
  if (!item) return null;
  return {
    ...item,
    id: item._id,
    image: normalizeImageUrl(item.image),
    images: Array.isArray(item.images) ? item.images.map(normalizeImageUrl) : [],
  };
};

// ============================================================
// Item Service — Real API endpoints
// ============================================================

export const itemService = {
  // ──────────────────────────────────────────────
  // REAL API: GET /api/items
  // Returns all items in the marketplace, mapping _id to id
  // ──────────────────────────────────────────────
  getItems: async () => {
    const res = await api.get("/items");
    const items = (res.data && res.data.data && res.data.data.items) || [];
    return items.map(mapItem).filter(Boolean);
  },

  // ──────────────────────────────────────────────
  // REAL API: GET /api/items/:id
  // Returns a single item by ID, mapping _id to id
  // ──────────────────────────────────────────────
  getItem: async (id) => {
    const res = await api.get(`/items/${id}`);
    const item = (res.data && res.data.data && res.data.data.item) || null;
    return mapItem(item);
  },

  // ──────────────────────────────────────────────
  // REAL API: POST /api/items
  // Creates a new item listing, mapping _id to id
  // ──────────────────────────────────────────────
  createItem: async (itemData) => {
    const res = await api.post("/items", itemData);
    const item = (res.data && res.data.data && res.data.data.item) || null;
    return item ? { ...item, id: item._id } : null;
  },

  // ──────────────────────────────────────────────
  // REAL API: PUT /api/items/:id
  // Updates an existing item listing, mapping _id to id
  // ──────────────────────────────────────────────
  updateItem: async (id, itemData) => {
    const res = await api.put(`/items/${id}`, itemData);
    const item = (res.data && res.data.data && res.data.data.item) || null;
    return item ? { ...item, id: item._id } : null;
  },

  // ──────────────────────────────────────────────
  // REAL API: DELETE /api/items/:id
  // Deletes an item listing
  // ──────────────────────────────────────────────
  deleteItem: async (id) => {
    const res = await api.delete(`/items/${id}`);
    return res.data;
  },

  // ──────────────────────────────────────────────
  // REAL API: GET /api/items/matches/:id
  // Returns potential matches for a given item, mapping _id to id
  // ──────────────────────────────────────────────
  getMatches: async (id) => {
    const res = await api.get(`/items/matches/${id}`);
    const matches = (res.data && res.data.data && res.data.data.matches) || (res.data && res.data.data && res.data.data.matches) || [];
    return matches.map((item) => ({ ...item, id: item._id }));
  },

  // ──────────────────────────────────────────────
  // Client-side search filter (no backend search endpoint)
  // Fetches all items then filters locally
  // ──────────────────────────────────────────────
  searchItems: async (query = "", category = "All") => {
    const allItems = await itemService.getItems();
    return allItems.filter((item) => {
      const matchesSearch =
        !query ||
        (item.title || "").toLowerCase().includes(query.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(query.toLowerCase()) ||
        (item.lookingFor || "").toLowerCase().includes(query.toLowerCase());

      const matchesCategory = category === "All" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  },
};

export default itemService;
