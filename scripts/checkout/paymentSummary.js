import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { deliverOptions } from "../../data/deliveryOptions.js";

export function renderPaymentSummary() {
  const {totalPrice, totalQuantity} = calculateCartSummary();
  const deliveryCharges = calculateDeliveryCharges();
  const totalTaxes = (totalPrice + deliveryCharges) / 10;
  const totalAmount = Math.round((totalPrice + deliveryCharges + totalTaxes) * 10) / 10;
  
  let paymentSummaryHTML = `
    <div class="payment-summary-title payment-line">
      Price Details
    </div>
    <div class="payment-summary-row">
      <div>Price(${totalQuantity} items):</div>
      <div class="payment-summary-money">₹${totalPrice}</div>
    </div>
    <div class="payment-summary-row">
      <div>Delivery Charges</div>
      <div class="payment-summary-money">${
        deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`
      }</div>
    </div>
    <div class="payment-summary-row payment-line">
      <div>Total taxes(10%):</div>
      <div class="payment-summary-money">₹${totalTaxes}</div>
    </div>
    <div class="payment-summary-row payment-line total-row">
      <div>Total Amount:</div>
      <div class="payment-summary-money">₹${totalAmount}</div>
    </div>
  `;

  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;
}

function calculateCartSummary() {
  let totalPrice = 0;
  let totalQuantity = 0;

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const quantity = cartItem.quantity;
    totalQuantity += quantity;

    const matchingProduct = products.find((product) => product.id === productId);
    totalPrice += matchingProduct.price * quantity;
  });

  return { totalPrice, totalQuantity };
}

function calculateDeliveryCharges() {
  let deliveryCharges = 0;

  cart.forEach((cartItem) => {
    const deliverOptionId = cartItem.deliverOptionId;

    const matchingDeliverOptionId = deliverOptions.find((deliverOption) => deliverOption.id === deliverOptionId);

    deliveryCharges += matchingDeliverOptionId.price;
  })

  return deliveryCharges;
}