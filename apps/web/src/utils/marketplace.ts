export const formatListingPrice = (price?: number): string =>
    price !== undefined ? `Rs. ${price.toLocaleString()}` : "Contact for price";
