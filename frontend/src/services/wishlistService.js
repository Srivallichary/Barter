import api from "./api";

export const wishlistService = {
  getWishlist: async () => {
    const res = await api.get("/wishlist");
    return res.data.wishlist || [];
  },

  addWishlist: async (itemId) => {
    const res = await api.post(`/wishlist/${itemId}`);
    return res.data.wishlist || [];
  },

  removeWishlist: async (itemId) => {
    const res = await api.delete(`/wishlist/${itemId}`);
    return res.data.wishlist || [];
  }
};

export default wishlistService;
