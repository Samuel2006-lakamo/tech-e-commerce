import { getProducts } from "./products.js";

const renderProducts = async () => {
    try {
        const products = await getProducts();
        let html = "";
        products.filter(product => {
           const featuredProduct = product.isFeartured == false;
        });
        products.forEach(product => {
            html += `  
    <div class="product-card">  
      <img src="./${product.image}" alt="${product.name}" />  
      <div class="grid-content">  
        <h2 class="product-heading">${product.name}</h2>  
        <p class="product-info">${product.description}</p>  
        <h3 class="product-price">€ ${(product.priceCents / 100).toFixed(
            2
        )}</h3>  
        <button class="btn add-to-cart-btn">Add to Cart</button>  
      </div>  
    </div>  
  `;
        });

        document.querySelector(".product-grid").innerHTML = html;
    } catch (err) {
        console.error("Failed to render products:", err);
    }
};

renderProducts();
const menuBtn = document.querySelector(".menu-toggle");
const overlay = document.querySelector(".overlay");
const close = document.querySelector(".close");
const sidebar = document.querySelector(".sidebar");

menuBtn.addEventListener("click", () => {
    sidebar.classList.remove("hidden");
    overlay.classList.add("show");

    document.body.classList.add("no-scroll");
});
close.addEventListener("click", () => {
    sidebar.classList.add("hidden");
    overlay.classList.remove("show");
    document.body.classList.remove("no-scroll");
});

let startX = 0;

document.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

document.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;

    if (startX - endX > 70) {
        // Swiped Left
        sidebar.classList.add("hidden");
        overlay.classList.remove("show");
        document.body.classList.remove("no-scroll");
    }
    if (startX < 30 && endX - startX > 50) {
        sidebar.classList.remove("hidden");
        overlay.classList.add("show");
        document.body.classList.add("no-scroll");
    }
});
