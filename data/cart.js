import { renderOrderSummary } from "../scripts/checkout/renderOrderSummary.js";
import { renderPaymentSummary } from "../scripts/checkout/paymentSummary.js";

export let cart = JSON.parse(localStorage.getItem('cart'));

if(!cart){
  cart = [{
    productId: 'c73f8d1a-91a7-4c5e-9177-965b9b58a7fa',
    quantity: 2,
    deliverOptionId: '1'
  },
  {
    productId: 'b46ac0e4-4725-4b2f-9d29-cd3219f382d9',
    quantity: 1,
    deliverOptionId: '2'
  }];
}

let timeoutId;

export function addToCart(productId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if(matchingItem) {
    matchingItem.quantity ++;
  } else {
    cart.push({
      productId,
      quantity: 1,
      deliverOptionId: '1'
    });
  }
  
  saveToStorage();

  const addedMarkElement = document.querySelector(`.added-mark-${productId}`);
  if (addedMarkElement) {
    if(timeoutId){
      clearTimeout(timeoutId);
    }

    addedMarkElement.style.visibility = 'visible';
    timeoutId = setTimeout(() => {
      addedMarkElement.style.visibility = 'hidden'; 
    }, 1500); 
  }

  updateCartQuantity();
}

export function removeFromCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  let index = cart.findIndex((cartItem) => cartItem.productId === productId);

  if(index !== -1){
    cart.splice(index, 1);
  }

   saveToStorage();

  renderOrderSummary();
  renderPaymentSummary();

  return cart;
}

export function increaseQuantity(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity ++;

  if(matchingItem.quantity > 999) {
    matchingItem.quantity = 999;
    alert('Only 999 items of this product is permitted to be bought for personal accounts.');
  }
  saveToStorage();
  renderOrderSummary();
  renderPaymentSummary();
}

export function decreaseQuantity(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity --;

  if(matchingItem.quantity < 1){
    removeFromCart(productId)
  }
  saveToStorage();
  renderOrderSummary();
  renderPaymentSummary();
}

export function updateCartQuantity() {
  let cartQuantity = 0;
  const cartQuantityElement = document.querySelector('.js-cart-quantity');

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  if(cartQuantity < 1) {
    cartQuantityElement.style.visibility = 'hidden';
  } else{
  document.querySelector('.js-cart-quantity')
    .innerText = cartQuantity;
    cartQuantityElement.style.visibility = 'visible';
  }
}

export function inputQuantityUpdate(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;

  if(matchingItem.quantity < 1){
    removeFromCart(productId)
  } else if(matchingItem.quantity > 999){
    alert('Only 999 items of this product is permitted to be bought for personal accounts.');
    matchingItem.quantity = 999;
  }
  saveToStorage();
  renderPaymentSummary();
  renderOrderSummary();
  updateCartQuantity();
}

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  const matchingItem = cart.find((cartItem) => cartItem.productId === productId);
  if (matchingItem) {
    matchingItem.deliverOptionId = deliveryOptionId;
    saveToStorage();
    renderOrderSummary();
    renderPaymentSummary();
  }
}