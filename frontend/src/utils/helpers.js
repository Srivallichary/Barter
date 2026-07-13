export const formatPrice = (value) => {
  return `$${Number(value).toFixed(2)}`;
};

export const getApiHost = () => {
  return (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");
};

export const normalizeImageUrl = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/uploads")) {
    return `${getApiHost()}${url}`;
  }
  if (url.startsWith("uploads")) {
    return `${getApiHost()}/${url}`;
  }
  return url;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
