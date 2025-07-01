export const getProducts = async function() {
try {
  const response = await fetch(`../backend/products.json`);
  const data = await response.json();
  return data
} catch (err) {
  console.error('Error:', err);
  
}
}

