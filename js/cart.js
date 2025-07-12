// Refacter
export const cart = JSON.parse(localStorage.getItem("cart")) || [];
export function itemExist(id) {
    return cart.find(item => item.id === id);
}

export function addToCart(item) {
    const existingItem = itemExist(item.id);

    if (existingItem) {
        existingItem.quantity += 1;
        if (typeof showInfoAlert === "function") {
            showInfoAlert(`Increased quantity of ${item.name}`);
        }
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
        if (typeof showSuccessAlert === "function") {
            showSuccessAlert(`${item.name} was added`);
        }
    }
    saveToStorage();
    renderCart();
    console.log("added to cart");
}

export const renderCart = function () {
  
  const parent = document.querySelector(".order-wrapper");
    
    let cartHtml = "";
    cart.forEach(item => {
      cartHtml += ` 
    <div class="order-item">
            <img src="./${item.image}" alt="Product">
            <div class="grid-content">
                <h2 class="product-heading">${item.name}</h2>
                <h3 class="product-price">€ ${(item.priceCents / 100).toFixed(
                    2
                )}</h3>
            </div>
            <div class="quantity-selector">
                <button>-</button>
                <span class="quantity">${item.quantity}</span>
                <button>+</button>
            </div>
        </div>`;
    });
    if (parent) {
      parent.innerHTML = '';
        parent.insertAdjacentHTML("beforeend", cartHtml);
    }
};
export function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);

    if (index !== -1) {
        const item = cart[index];
        cart.splice(index, 1);
        if (typeof showInfoAlert === "function") {
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
        if (typeof showInfoAlert === "function") {
            showInfoAlert("Cart cleared");
        }
    }
}

export function getCartTotal() {
    return cart.reduce(
        (total, item) => total + item.priceCents * item.quantity,
        0
    );
}

export function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}
export function updateQuantity() {
  const orderItems = document.querySelectorAll(".order-item");
  if (!orderItems) return;

  orderItems.forEach((itemEl, index) => {
    const minusBtn = itemEl.querySelector(".quantity-selector button:first-child");
    const plusBtn = itemEl.querySelector(".quantity-selector button:last-child");
    const quantityDisplay = itemEl.querySelector(".quantity");

    minusBtn.addEventListener("click", () => {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        quantityDisplay.textContent = cart[index].quantity;
        saveToStorage();
      }
    });

    plusBtn.addEventListener("click", () => {
      cart[index].quantity++;
      quantityDisplay.textContent = cart[index].quantity;
      saveToStorage();
    });
  });
}
/*function updateQuantity() {
 const orderItem = document.querySelectorAll(".order-item");
 if (!orderItem) return;
 parent.forEach((item,index) => {
   const minusBtn = document.querySelector(".quantity-selector button:first-child");
   const plusBtn = document.querySelector(".quantity-selector button:last-child");
   const quantityArea = document.querySelector(".quantity");
   minusBtn.addEventListener("click", () => {
     if (cart[index].quantity > 1) {
       cart[index].quantity--;
       quantityArea.textContent = cart[index].quantity; 
       saveToStorage();
     }
     
   })
   plusBtn.addEventListener("click", () => {
     if (cart[index].quantity > 1) {
       cart[index].quantity ++;
       quantityArea.textContent = cart[index].quantity; 
       saveToStorage();
     }
     
   })
 });
 
}*/
function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}