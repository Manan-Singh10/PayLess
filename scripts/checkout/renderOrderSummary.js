import { cart, removeFromCart, increaseQuantity, decreaseQuantity, inputQuantityUpdate, saveToStorage, updateDeliveryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { deliverOptions } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let orderSummaryHTML = '';
  let deliveryDateSelected;

  checkCartIsEmpty();

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = findMatchingProduct(productId);

    const deliverOptionId = cartItem.deliverOptionId;

    let deliverOption;

    deliverOptions.forEach((option) => {
      if(option.id === deliverOptionId) {
        deliverOption = option;
      }
    });

    const today = dayjs();
    const deliveryDate = today.add(deliverOption.deliverDays, 'days');
    const dateString = deliveryDate.format('dddd, DD MMMM');

    orderSummaryHTML +=  `
      <div class="product-order-summary product-order-line">
        <div class="product-image-container">
        <img class="product-picture" src="images/product-picture/${matchingProduct.image}">
        </div>
        <div class="product-details-container">
          <div class="product-name">${matchingProduct.name}</div>
          <div class="product-price">₹${matchingProduct.price}</div>
          <div class="product-quatity">Quantity: ${cartItem.quantity}</div>
          <div class="edit-quantity">
            <div class="quantity-update-container">
              <button class="decrease-quantity js-decrease-quantity"
              data-product-id="${matchingProduct.id}">&#8722;</button>
              <input class="quantity-input 
              js-quantity-input
              js-quantity-input-${matchingProduct.id}"
              data-product-id="${matchingProduct.id}"
              type="text" value="${cartItem.quantity}">
              <button class="increase-quantity js-increase-quantity"
              data-product-id="${matchingProduct.id}">+</button>
            </div>
            <button class="remove-product 
            js-remove-product" data-product-id="${matchingProduct.id}">
              Remove
            </button>
          </div>
        </div>
        <div class="delivery-options">
          <div class="delivery-date">Delivery date: ${dateString}</div>
          ${deliverOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
      `
    ;
  });

  document.querySelector('.js-order-summary-container')
    .innerHTML = orderSummaryHTML;

  document.querySelectorAll('.js-remove-product')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const {productId} = button.dataset;
        removeFromCart(productId);
      });
    });

  document.querySelectorAll('.js-increase-quantity')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const {productId} = button.dataset;
      increaseQuantity(productId);
    });
  });

  document.querySelectorAll('.js-decrease-quantity')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const {productId} = button.dataset;
      decreaseQuantity(productId);
    });
  });

  document.querySelectorAll('.js-quantity-input')
    .forEach((input) => {
      input.addEventListener('keydown', (event) => {
        if(event.key === 'Enter'){
          const {productId} = input.dataset;
          const newInput = document.querySelector(`.js-quantity-input-${productId}`);
          const newQuantity = Number(newInput.value);
          inputQuantityUpdate(productId, newQuantity);
        }
      });
    });

    document.querySelectorAll('.js-delivery-option')
    .forEach((input) => {
      input.addEventListener('click', () => {
        const { productId, deliveryOptionId } = input.dataset;

        updateDeliveryOption(productId, deliveryOptionId);
      });
    });
}

function findMatchingProduct(productId) {
  return products.find((product) => 
    product.id === productId
  );
}

function checkCartIsEmpty() {
  if(cart.length === 0) {
    document.querySelector('.checkout-grid')
      .innerHTML = '';
    document.querySelector('.page-title')
      .innerHTML = 'No products in the cart :('
  }
}

function deliverOptionsHTML(matchingProduct, cartItem) {
  let html = ''

  deliverOptions.forEach((deliverOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliverOption.deliverDays, 'days');
    const dateString = deliveryDate.format('dddd, DD MMMM');
    const isChecked = cartItem.deliverOptionId === deliverOption.id;
    
    html +=
      `
      <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliverOption.id}">
        <input type="radio" 
        ${ isChecked ? 'Checked' : ''}
        class="delivery-option-input js-delivery-option-input" 
        name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${deliverOption.price === 0
              ? 'Free'
              : `₹${deliverOption.price} -`
            } Shipping
          </div>
        </div>
      </div>
     `
  });

  return html;
}
 