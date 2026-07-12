import api from "./api";

export const notificationService = {
  getNotifications: async () => {
    const res = await api.get("/notifications");
    return res.data.notifications || [];
  },

  markAsRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data.notification || res.data;
  }
};

export default notificationService;
