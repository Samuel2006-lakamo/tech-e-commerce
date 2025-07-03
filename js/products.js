export const getProducts = async function() {
  try {
    const response = await fetch(`../backend/products.json`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error:', err);
  }
};

let matchingItem; // Declare it outside

export async function productId(id) {
  const products = await getProducts();
  matchingItem = products.find(product => product.id === id);
  return matchingItem;
}