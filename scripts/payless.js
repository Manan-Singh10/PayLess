import { products } from "../data/products.js";
import { addToCart, updateCartQuantity } from "../data/cart.js";

let productsHTML = ``;
let matchingProduct = {};

renderProductsGrid(products);

function renderProductsGrid(products) {
  productsHTML = "";

  products.forEach((product) => {
    productsHTML += `
      <div class="product-container">
      <img class="product-picture" src="images/product-picture/${product.image}">
      <div class="product-name">${product.name}</div>
      <div class="product-rating-container">
        <div class="product-rating">${product.rating.stars.toFixed(1)}</div>
        <div class="rating-count">(${product.rating.count})</div>
      </div>
      <div class="product-price">₹${product.price}</div>
      <div class="added-mark added-mark-${product.id}">Added</div>
      <button class="add-to-cart-button
      js-add-to-cart" data-product-id="${product.id}">
        Add to cart
      </button>
    </div>
    `;

    return productsHTML;
  });
  
  document.querySelector('.products-grid')
    .innerHTML = productsHTML;

  document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const {productId} = button.dataset;
        addToCart(productId);
      })
    });

  updateCartQuantity();
}

document.querySelector('.js-search-input')
  .addEventListener('keydown', (event) => {
    let filteredProducts;

    if (event.key === 'Enter') {
      const query = document.querySelector('.js-search-input')
        .value.toLowerCase();

      filteredProductsHTML(query, filteredProducts);
    }
  });

function filteredProductsHTML(query, filteredProducts) {
  filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(query) || 
    product.keywords.some(keyword => keyword.toLowerCase().includes(query))
  );

  const div = document.querySelector('.products-grid');

  div.innerHTML = "";

  if(filteredProducts.length === 0) {
    div.innerHTML = "No matching product at this moment.";
    div.style.display = "flex";
    div.style.justifyContent = "center";
    document.querySelector('.js-search-input')
      .value = '';
    return;
  }

  div.style.display = "grid";
  renderProductsGrid(filteredProducts);
  document.querySelector('.js-search-input')
    .value = '';
}

document.querySelectorAll('.js-category')
  .forEach((category) => {
    category.addEventListener('click', () => {
      const query = category.dataset.category;
      let filteredProducts;

      filteredProductsHTML(query, filteredProducts);
    });
  })