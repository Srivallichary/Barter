export const formatPrice = (value) => {
  return `$${Number(value).toFixed(2)}`;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
