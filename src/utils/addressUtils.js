/**
 * Formats an address object or string into a flattened string representation.
 * @param {Object|string} address The address to format.
 * @returns {string} The formatted address string.
 */
export const formatAddress = (address) => {
  if (!address) return '';
  if (typeof address === 'string') return address;

  const parts = [];
  if (address.address) parts.push(address.address);
  if (address.street2) parts.push(address.street2);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zip) parts.push(address.zip);
  if (address.country) parts.push(address.country);

  return parts.filter(Boolean).join(', ');
};

/**
 * Safely extracts a displayable string from various data types.
 * @param {any} data The data to extract a string from.
 * @returns {string} A displayable string.
 */
export const safeRender = (data) => {
  if (data === null || data === undefined) return '';
  if (typeof data === 'string') return data;
  if (typeof data === 'number') return String(data);
  
  // If it's an object, try to find a printable property
  if (typeof data === 'object') {
    if (data.categoryId && data.subCategory) {
       return `${data.categoryId} > ${data.subCategory}`;
    }
    return data.name || data.companyName || data.label || data.title || data.subject || data.categoryId || data.category || '';
  }
  
  return '';
};
