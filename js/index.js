import { getProducts,productId } from  "./products.js";
import { cart,itemExist } from  "./cart.js";
const added = document.querySelector(".added");
const renderProducts = async () => {
    try {
        const products = await getProducts();
        let html = "";
        let featureHtml = "";
        const featureProductEl = document.querySelector("#feature-product");
        const allProductEl = document.querySelector("#all-product");

        const featuredProduct = products.filter(product => product.isFeatured);
        featuredProduct.forEach(product => {
            featureHtml += `
          <div class="product-card">  
      <img src="./${product.image}" alt="${product.name}" />  
      <div class="grid-content">  
        <h2 class="product-heading">${product.name}</h2>  
        <p class="product-info">${product.description}</p>  

<div class="rating">
        <img class="rating-star" src="../images/rating/rating-${product.rating.stars * 10}.png"/>
        <p>${product.rating.count}</p>
</div>
        <h3 class="product-price">€ ${(product.priceCents / 100).toFixed(
            2
        )}</h3>  
        
                <div class="added">
        <img class="" src="../images/icon/checkmark.png"/>
        <p>Added<p/>
        </div>
        <button class="btn add-to-cart-btn"
        data-id="${product.id}"
        
        ">Add to Cart</button>  
      </div>  
    </div>  
  `;
        });

        products.forEach(product => {
            html += `  
    <div class="product-card">  
      <img src="./${product.image}" alt="${product.name}" />  
      <div class="grid-content">  
        <h2 class="product-heading">${product.name}</h2>  
        <p class="product-info">${product.description}</p>  <div class="rating">
        <img class="rating-star" src="../images/rating/rating-${product.rating.stars * 10}.png"/>
        <p>${product.rating.count}<p/>
</div>
        <h3 class="product-price">€ ${(product.priceCents / 100).toFixed(
            2
        )}</h3>  

        <div class="added">
        <img class="" src="../images/icon/checkmark.png"/>
        <p>Added</p>
        </div>
        <button class="btn add-to-cart-btn" 
        data-id="${product.id}"
        
        ">Add to Cart</button>  
      </div>  
    </div>  
  `;
        });

        if (featureProductEl) {
            featureProductEl.innerHTML = featureHtml;
        }

        if (allProductEl) {
            allProductEl.innerHTML = html;
        }
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", async (e) => {
    const itemId = e.target.dataset.id;
    await addToCart(itemId, e.target); // Pass the button itself
  });
});

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
    if (startX < 70 && endX - startX > 50) {
        sidebar.classList.remove("hidden");
        overlay.classList.add("show");
        document.body.classList.add("no-scroll");
    }
});

const timeoutMap = new Map();
async function addToCart(id, btn) {
  const matchingItem = await productId(id);
if (!matchingItem) {
  throw new Error(`Item with id ${id} is not found`);
  return
}
  const addedMessage = btn.parentElement.querySelector(".added");

  addedMessage.classList.add("show");
  if (timeoutMap.has(id)) {
  clearTimeout(timeoutMap.get(id));
}

const timeoutId =  setTimeout(function() {
    addedMessage.classList.remove("show");
  }, 2000);
  timeoutMap.set(id,timeoutId)
  const existingItem = itemExist(id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const name = matchingItem.name;
  cart.push({
    id: matchingItem.id,
    name,
    quantity: 1
  })
  }

  console.log(cart);
}
