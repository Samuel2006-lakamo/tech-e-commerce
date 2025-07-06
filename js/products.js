let productsCache = null;
let fetchPromise = null;

/**
 * @returns {Promise<Array>}
*/

export const getProducts = async function () {
  if (productsCache) {
    return productsCache;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = fetchProductsFromBackend();

  try {
    productsCache = await fetchPromise;
    return productsCache;
  } catch (err) {
    fetchPromise = null;
    throw err;
  } finally {
    fetchPromise = null;
  }
};

/**
 * @returns {Promise<Array>} 
 */

const fetchProductsFromBackend = async () => {
  try {
    const response = await fetch(`backend/products.json`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching products:', err);
    // ใช้ Alert System ใหม่แสดง error
    if (typeof showErrorAlert === 'function') {
      showErrorAlert('Failed to load products. Please try again later.');
    }
    throw err;
  }
};

/**
 * @param {string} id
 * @returns {Promise<Object|undefined>} 
 */

export async function productId(id) {
  try {
    const products = await getProducts();
    const matchingItem = products.find(product => product.id === id);
    
    if (!matchingItem) {
      // ใช้ Alert System ใหม่แสดง warning
      if (typeof showWarningAlert === 'function') {
        showWarningAlert(`Product with ID ${id} not found.`);
      }
    }
    
    return matchingItem;
  } catch (err) {
    console.error(`Error: Finding product with id ${id}:`, err);
    // ใช้ Alert System ใหม่แสดง error
    if (typeof showErrorAlert === 'function') {
      showErrorAlert(`Error finding product: ${err.message}`);
    }
    return undefined;
  }
}

export const clearProductsCache = () => {
  productsCache = null;
  fetchPromise = null;
};

/**
 * @returns {Promise<Array>}
 */

export const preloadProducts = async () => {
  return getProducts();
};