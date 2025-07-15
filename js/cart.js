
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
    updateCartUi();
    console.log("added to cart");
}

export const renderCart = function () {
    const parent = document.querySelector(".order-wrapper");
    
    if (!parent) return;
    
    let cartHtml = "";
    cart.forEach(item => {
        cartHtml += ` 
        <div class="order-item">
            <img src="./${item.image}" alt="Product">
            <div class="grid-content">
                <h2 class="product-heading">${item.name}</h2>
                <div class="price-delete">
                    <h3 class="product-price">€ ${(item.priceCents / 100).toFixed(2)}</h3>
                    <i class="fas fa-trash delete-item" data-id="${item.id}"></i>
                </div>
            </div>
            <div class="quantity-selector">
                <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
            </div>
        </div>`;
    });
    
    parent.innerHTML = cartHtml;
    
    // CRITICAL: Set up event listeners AFTER rendering HTML
   setupCartEventListeners();
};

export function renderPaymentSummary() {
    const shipping = Math.floor(Math.random() * (1000 - 800 + 1)) + 800;
    const parent = document.querySelector(".payment-summary-wrapper");
    
    if (!parent) return;
    
    const paymentHtml = `
        <div class="summary-item">
            <span>Subtotal</span>
            <span>€ ${(subTotal() / 100).toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Tax</span>
            <span>€ 5.00</span>
        </div>
        <div class="summary-item">
            <span>Shipping</span>
            <span>€ ${(shipping / 100).toFixed(2)}</span>
        </div>
        <div class="summary-item total">
            <span>Total</span>
            <span>€ ${(getCartTotal(shipping) / 100).toFixed(2)}</span>
        </div>
    `;
    
    parent.innerHTML = paymentHtml;
}

export function removeFromCart(id) {
    console.log("Removing item with id:", id);
    const index = cart.findIndex(item => item.id === id);
    
    if (index !== -1) {
        const item = cart[index];
        cart.splice(index, 1);
        saveToStorage();
        updateCartUi();
        
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
    saveToStorage();

    if (itemCount > 0) {
        if (typeof showInfoAlert === "function") {
            showInfoAlert("Cart cleared");
        }
        updateCartUi();
    }
}

function subTotal() {
    return cart.reduce(
        (total, item) => total + item.priceCents * item.quantity,
        0
    );
}

export function getCartTotal(shipping) {
    const itemTotal = subTotal();
    const taxCents = 500; // 5.00 in cents
    const overallTotal = itemTotal + taxCents + shipping;
    return overallTotal;
}

export function getCartItemCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

export function renderCartQuantity() {
    const cartNumber = document.querySelector(".cart-number");
    if (!cartNumber) return;
    
    cartNumber.textContent = `Checkout(${getCartItemCount()})`;
}

// FIXED: Event listener setup function
function setupCartEventListeners() {
    console.log("Setting up cart event listeners...");
    
    // Delete button listeners
    const deleteButtons = document.querySelectorAll(".delete-item");
    console.log("Found delete buttons:", deleteButtons.length);
    
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            console.log("Delete button clicked");
            const itemId = e.target.dataset.id;
            console.log("Item ID to delete:", itemId);
            removeFromCart(itemId);
        });
    });

    // Quantity update listeners
    const quantityButtons = document.querySelectorAll(".quantity-btn");
    console.log("Found quantity buttons:", quantityButtons.length);
    
    quantityButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            console.log("Quantity button clicked");
            const action = e.target.dataset.action;
            const id = e.target.dataset.id;
            console.log("Action:", action, "ID:", id);
            
            const item = cart.find(item => item.id === id);
            
            if (!item) {
                console.log("Item not found in cart");
                return;
            }
            
            if (action === "increase") {
                item.quantity++;
                console.log("Increased quantity to:", item.quantity);
            } else if (action === "decrease" && item.quantity > 1) {
                item.quantity--;
                console.log("Decreased quantity to:", item.quantity);
            }
            
            saveToStorage();
            updateCartUi();
        });
    });
}

export function updateCartUi() {
    console.log("Updating cart UI...");
    renderCart();
    renderCartQuantity();
    renderPaymentSummary();
}

function saveToStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart saved to storage:", cart);
}