import { getProducts, productId } from "./products.js";
import { cart, itemExist, addToCart as addToCartFunction } from "./cart.js";

import { store, jwt, logout as logoutUser } from "./login.js";
import { initAuthGuard } from "./auth-guard.js";

// #DEFINE Variables
const added = document.querySelector(".added");
const timeoutMap = new Map();

const menuBtn = document.querySelector(".menu-toggle");
const overlay = document.querySelector(".overlay");
const close = document.querySelector(".close");
const sidebar = document.querySelector(".sidebar");

let currentUser = null;
let isLoggedIn = false;

const checkLoginStatus = () => {
  const token = store.get('token');
  const userData = store.get('user');

  if (token && userData && jwt.decode(token)) {
    currentUser = userData;
    isLoggedIn = true;
    console.log('User logged in:', currentUser);
    updateUIForLoggedInUser();
    return true;
  } else {
    currentUser = null;
    isLoggedIn = false;
    console.log('User not logged in');
    updateUIForLoggedOutUser();
    return false;
  }
};

const updateUIForLoggedInUser = () => {
  const navbarUser = document.querySelector('#navbarUser');
  if (navbarUser && currentUser) {
    navbarUser.textContent = currentUser.name;
  }

  const sidebarUser = document.querySelector('#sidebarUser');
  if (sidebarUser && currentUser) {
    sidebarUser.textContent = currentUser.name;
  }

  const userElements = document.querySelectorAll('.user-only');
  userElements.forEach(el => el.style.display = 'block');

  const loginElements = document.querySelectorAll('.login-only');
  loginElements.forEach(el => el.style.display = 'none');

  console.log('UI updated for logged in user:', currentUser.name);
};

const updateUIForLoggedOutUser = () => {
  const userElements = document.querySelectorAll('.user-only');
  userElements.forEach(el => el.style.display = 'none');

  const loginElements = document.querySelectorAll('.login-only');
  loginElements.forEach(el => el.style.display = 'block');

  console.log('UI updated for logged out user');
};

const handleLogout = () => {
  logoutUser();
  checkLoginStatus();
  console.log('User logged out successfully');
};

const showDeleteWarning = () => {
  const alertId = showAlert({
    type: 'warning',
    message: 'Are you sure you want<br>To delete your account?',
    icon: '<i class="fas fa-exclamation-triangle"></i>',
    persistent: true,
    autoDismiss: false
  });

  const alertData = activeAlerts.get(alertId);
  if (alertData) {
    const { element } = alertData;
    const messageDiv = element.querySelector('.message');

    const buttonsHTML = `
      <div class="warning-buttons">
        <button class="btn-cancel" data-alert-id="${alertId}">Cancel</button>
        <button class="btn-confirm" data-alert-id="${alertId}">Confirm</button>
      </div>
    `;

    messageDiv.innerHTML += buttonsHTML;

    const cancelBtn = element.querySelector('.btn-cancel');
    const confirmBtn = element.querySelector('.btn-confirm');

    cancelBtn.addEventListener('click', () => {
      closeAlert(alertId);
    });

    confirmBtn.addEventListener('click', () => {
      closeAlert(alertId);
      confirmDeleteAccount();
    });
  }
};

const hideDeleteWarning = () => {
  closeAllAlerts();
};

const confirmDeleteAccount = () => {
  const user = store.get('user');
  if (!user) {
    showErrorAlert('No user found');
    return;
  }

  let users = store.get('users') || [];
  users = users.filter(u => u.id !== user.id);
  store.set('users', users);

  store.remove('token');
  store.remove('user');

  showSuccessAlert('Account deleted successfully');

  window.location.href = 'Login.html';
};

const showDeleteError = (message) => {
  showErrorAlert(message);
};

const showDeleteSuccess = (message) => {
  showSuccessAlert(message);
};

const handleDeleteAccount = () => {
  showDeleteWarning();
};

const initializeLogoutListeners = () => {
  const logoutBtns = document.querySelectorAll('.logout-btn');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', handleLogout);
  });
};

const showLoginNotification = () => {
  if (typeof showSuccessAlert === 'function') {
    showSuccessAlert('Login Successfully', {
      autoDismiss: true,
      dismissDelay: 5000
    });
  } else {
    setTimeout(() => {
      if (typeof showSuccessAlert === 'function') {
        showSuccessAlert('Login Successfully', {
          autoDismiss: true,
          dismissDelay: 5000
        });
      }
    }, 100);
  }
};

const closeNotification = () => {
  closeAllAlerts();
};

window.closeNotification = closeNotification;
window.deleteAccount = handleDeleteAccount;
window.hideDeleteWarning = hideDeleteWarning;
window.confirmDeleteAccount = confirmDeleteAccount;

/**
 * @param {Object} product
 * @returns {string}
 */

const createProductCardHTML = (product) => {
  return `
    <div class="product-card">  
      <img src="./${product.image}" alt="${product.name}" />  
      <div class="grid-content">  
        <h2 class="product-heading">${product.name}</h2>  
        <p class="product-info">${product.description}</p>  
        <div class="rating">
          <img class="rating-star" src="../images/rating/rating-${product.rating.stars * 10}.png"/>
          <p>${product.rating.count}</p>
        </div>
        <h3 class="product-price">€ ${(product.priceCents / 100).toFixed(2)}</h3>  
        <div class="added">
          <img class="" src="../images/icon/checkmark.png"/>
          <p>Added</p>
        </div>
        <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>  
      </div>  
    </div>  
  `;
};

/**
 * @param {Array} products
 */

const renderFeaturedProducts = (products) => {
  const featureProductEl = document.querySelector("#feature-product");
  if (!featureProductEl) return;

  const featuredProduct = products.filter(product => product.isFeatured);
  const featureHtml = featuredProduct.map(product => createProductCardHTML(product)).join("");

  featureProductEl.innerHTML = featureHtml;
};

/**
 * @param {Array} products
 */

const renderAllProducts = (products) => {
  const allProductEl = document.querySelector("#all-product");
  if (!allProductEl) return;

  const html = products.map(product => createProductCardHTML(product)).join("");
  allProductEl.innerHTML = html;
};

const attachCartButtonListeners = () => {
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const itemId = e.target.dataset.id;
      await addToCart(itemId, e.target);
    });
  });
};

const renderProducts = async () => {
  if (!isLoggedIn) {
    console.log('User not logged in, skipping product fetch');
    return;
  }

  try {
    const products = await getProducts();

    renderFeaturedProducts(products);
    renderAllProducts(products);
    attachCartButtonListeners();

  } catch (err) {
    console.error("Failed to render products:", err);
  }
};

/**
 * @param {boolean} show 
 */

const toggleSidebar = (show) => {
  if (show) {
    sidebar.classList.remove("hidden");
    overlay.classList.add("show");
    document.body.classList.add("no-scroll");
  } else {
    sidebar.classList.add("hidden");
    overlay.classList.remove("show");
    document.body.classList.remove("no-scroll");
  }
};

const initializeSidebarListeners = () => {
  menuBtn.addEventListener("click", () => {
    toggleSidebar(true);
  });

  close.addEventListener("click", () => {
    toggleSidebar(false);
  });
};

const initializeTouchListeners = () => {
  let startX = 0;

  document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  document.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;

    if (startX - endX > 70) {
      toggleSidebar(false);
    }

    if (startX < 70 && endX - startX > 50) {
      toggleSidebar(true);
    }
  });
};

/**
 * @param {string} id
 * @param {HTMLElement} addedMessage
 */

const showAddedMessage = (id, addedMessage) => {
  addedMessage.classList.add("show");

  if (timeoutMap.has(id)) {
    clearTimeout(timeoutMap.get(id));
  }

  const timeoutId = setTimeout(() => {
    addedMessage.classList.remove("show");
  }, 2000);

  timeoutMap.set(id, timeoutId);
};

/**
 * @param {Object} matchingItem 
 * @param {string} id
 */

const updateCart = (matchingItem, id) => {
  addToCartFunction(matchingItem);

  console.log('Cart updated:', cart);
  console.log('Current user:', currentUser);
};

/**
 * @param {string} id 
 * @param {HTMLElement} btn
 */
async function addToCart(id, btn) {
  try {
    const matchingItem = await productId(id);

    if (!matchingItem) {
      throw new Error(`Item with id ${id} is not found`);
    }

    const addedMessage = btn.parentElement.querySelector(".added");

    showAddedMessage(id, addedMessage);
    updateCart(matchingItem, id);

  } catch (error) {
    console.error("Error adding item to cart:", error);
    if (typeof showErrorAlert === 'function') {
      showErrorAlert('Failed to add item to cart. Please try again.');
    }
  }
}

const setCurrentYear = () => {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
};
/*document.addEventListener("DOMContentLoaded", () => {
    const quantitySelectors = document.querySelectorAll(".quantity-selector");

    quantitySelectors.forEach(selector => {
        const decreaseBtn = selector.querySelector("button:first-child");
        const increaseBtn = selector.querySelector("button:last-child");
        const quantityDisplay = selector.querySelector(".quantity");

        decreaseBtn.addEventListener("click", () => {
            let quantity = parseInt(quantityDisplay.textContent);
            if (quantity > 1) {
                quantity--;
                quantityDisplay.textContent = quantity;
            }
        });

        increaseBtn.addEventListener("click", () => {
            let quantity = parseInt(quantityDisplay.textContent);
            quantity++;
            quantityDisplay.textContent = quantity;
        });
    });
});*/
const init = () => {
  initAuthGuard();
  setCurrentYear();

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('login') === 'success') {
    console.log('Login success parameter detected');
    setTimeout(() => {
      showLoginNotification();
    }, 100);
  }

  const loggedIn = checkLoginStatus();

  if (loggedIn) {
    renderProducts();
    initializeSidebarListeners();
    initializeTouchListeners();
    initializeLogoutListeners();
  }
};

init();