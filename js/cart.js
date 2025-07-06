// Refacter
export const cart = [];

export function itemExist(id) {
  return cart.find((item) => item.id === id);
}

export function addToCart(item) {
  const existingItem = itemExist(item.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
    if (typeof showInfoAlert === 'function') {
      showInfoAlert(`Increased quantity of ${item.name}`);
    }
  } else {
    cart.push({
      ...item,
      quantity: 1
    });
    if (typeof showSuccessAlert === 'function') {
      showSuccessAlert(`${item.name} was added`);
    }
  }
}

export function removeFromCart(id) {
  const index = cart.findIndex(item => item.id === id);
  
  if (index !== -1) {
    const item = cart[index];
    cart.splice(index, 1);
    if (typeof showInfoAlert === 'function') {
      showInfoAlert(`${item.name} removed from cart`);
    }
    return true;
  }
  
  return false;
}

export function clearCart() {
  const itemCount = cart.length;
  cart.length = 0;
  
  if (itemCount > 0) {
    if (typeof showInfoAlert === 'function') {
      showInfoAlert('Cart cleared');
    }
  }
}

export function getCartTotal() {
  return cart.reduce((total, item) => total + (item.priceCents * item.quantity), 0);
}

export function getCartItemCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}