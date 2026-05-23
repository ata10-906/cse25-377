/* ============================================================
   ProSport Gear  –  javascript.js
   ============================================================
   What this file does (one job per section):

   SECTION 1  –  Cart storage helpers  (save/load cart from localStorage)
   SECTION 2  –  Add to Cart           (called by every BUY NOW button)
   SECTION 3  –  Cart badge            (red number on the navbar cart icon)
   SECTION 4  –  Cart modal            (the popup list that opens when you
                                        click the cart icon in the navbar)
   SECTION 5  –  Remove item           (checkbox + Remove Selected button)
   SECTION 6  –  Proceed to Payment    (button inside the cart modal)
   SECTION 7  –  Payment method choice (Visa / Mastercard / PayPal selector)
   SECTION 8  –  Payment form submit   (validates fields, shows success/error)
   SECTION 9  –  Search bar
   SECTION 10 –  Feedback form
   SECTION 11 –  Star rating
   SECTION 12 –  Clothing tabs         (Men / Women / Kids)
   SECTION 13 –  Equipment tabs        (Football / Basketball / Tennis)
   SECTION 14 –  Navbar scroll shadow
   SECTION 15 –  Page load             (runs everything when page opens)
   ============================================================ */


/* ============================================================
   SECTION 1  –  CART STORAGE HELPERS
   We use localStorage so the cart stays full when you move
   between pages.  localStorage only stores text, so we use
   JSON.stringify / JSON.parse to convert the array.
   ============================================================ */

function getCart() {
  var stored = localStorage.getItem('prosport_cart');
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cartArray) {
  localStorage.setItem('prosport_cart', JSON.stringify(cartArray));
}


/* ============================================================
   SECTION 2  –  ADD TO CART
   Called by every "BUY NOW" or "ADD TO CART" button:
     onclick="addToCart('Vest', 110)"
   ============================================================ */

function addToCart(productName, productPrice) {
  var cart = getCart();

  // Give the item a unique id so we can remove it later
  var item = {
    id:    Date.now(),
    name:  productName,
    price: Number(productPrice)
  };

  cart.push(item);
  saveCart(cart);
  updateCartBadge();

  // Show a quick confirmation to the customer
  alert('✔  "' + productName + '" (P' + productPrice + ') was added to your cart!');
}


/* ============================================================
   SECTION 3  –  CART BADGE
   Shows a red number on the cart icon so the customer can see
   how many items are waiting.
   ============================================================ */

function updateCartBadge() {
  var cartIcon = document.querySelector('.cart-icon');
  if (!cartIcon) return;

  var count = getCart().length;
  var badge = document.getElementById('cart-badge');

  if (!badge) {
    badge = document.createElement('span');
    badge.id = 'cart-badge';
    badge.style.cssText =
      'background:red; color:white; border-radius:50%;' +
      'padding:2px 7px; font-size:0.68rem; position:relative;' +
      'top:-12px; left:-10px; font-weight:bold; pointer-events:none;';
    cartIcon.parentNode.appendChild(badge);
  }

  badge.textContent   = count;
  badge.style.display = count > 0 ? 'inline' : 'none';
}


/* ============================================================
   SECTION 4  –  CART MODAL
   When the customer clicks the cart icon in the navbar a
   pop-up panel slides in from the right showing all cart items.
   Each item has a checkbox.  There is a REMOVE SELECTED button
   and a PROCEED TO PAYMENT button.
   ============================================================ */

/* Build and inject the modal HTML once */
function buildCartModal() {
  if (document.getElementById('cartModal')) return; // already built

  var modal = document.createElement('div');
  modal.id = 'cartModal';
  modal.style.cssText =
    'display:none; position:fixed; top:0; right:0; width:340px; max-width:95vw;' +
    'height:100%; background:#1a1a1a; color:#fff; z-index:9999;' +
    'box-shadow:-4px 0 18px rgba(0,0,0,0.6); flex-direction:column;' +
    'font-family:sans-serif; overflow:hidden;';

  modal.innerHTML = `
    <!-- HEADER -->
    <div style="background:#4a6741; padding:16px 18px; display:flex; justify-content:space-between; align-items:center;">
      <h2 style="font-size:1.1rem; letter-spacing:2px; text-transform:uppercase; margin:0;">
        <i class="fas fa-shopping-cart" style="margin-right:8px;"></i> Your Cart
      </h2>
      <button onclick="closeCartModal()"
        style="background:transparent; border:none; color:#fff; font-size:1.4rem; cursor:pointer;"
        title="Close">&#10005;</button>
    </div>

    <!-- ITEM LIST -->
    <div id="cartItemList"
      style="flex:1; overflow-y:auto; padding:14px 18px; min-height:0;">
      <!-- Items injected by renderCartItems() -->
    </div>

    <!-- FOOTER BUTTONS -->
    <div style="padding:14px 18px; border-top:1px solid #333; background:#111;">

      <!-- Totals row -->
      <div id="cartTotal"
        style="font-size:1rem; font-weight:700; margin-bottom:12px;
               color:#e87722; letter-spacing:1px;"></div>

      <!-- Remove selected -->
      <button onclick="removeSelectedItems()"
        style="width:100%; padding:10px; margin-bottom:10px;
               background:#555; color:#fff; border:none; border-radius:20px;
               font-size:0.9rem; font-weight:700; letter-spacing:1px;
               cursor:pointer; text-transform:uppercase; transition:background 0.2s;"
        onmouseover="this.style.background='#777'"
        onmouseout="this.style.background='#555'">
        <i class="fas fa-trash-alt" style="margin-right:6px;"></i>
        Remove Selected
      </button>

      <!-- Proceed to payment -->
      <button onclick="proceedToPayment()"
        style="width:100%; padding:10px;
               background:#e87722; color:#fff; border:none; border-radius:20px;
               font-size:0.9rem; font-weight:700; letter-spacing:1px;
               cursor:pointer; text-transform:uppercase; transition:background 0.2s;"
        onmouseover="this.style.background='#c96010'"
        onmouseout="this.style.background='#e87722'">
        <i class="fas fa-credit-card" style="margin-right:6px;"></i>
        Proceed to Payment
      </button>
    </div>
  `;

  // Overlay (dark background behind the modal)
  var overlay = document.createElement('div');
  overlay.id = 'cartOverlay';
  overlay.style.cssText =
    'display:none; position:fixed; inset:0; background:rgba(0,0,0,0.55); z-index:9998;';
  overlay.onclick = closeCartModal;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);
}

/* Fill the modal list with current cart items */
function renderCartItems() {
  var list = document.getElementById('cartItemList');
  var totalEl = document.getElementById('cartTotal');
  if (!list) return;

  var cart = getCart();

  if (cart.length === 0) {
    list.innerHTML =
      '<p style="text-align:center; color:#aaa; margin-top:30px;">' +
      '<i class="fas fa-shopping-basket" style="font-size:2rem; display:block; margin-bottom:10px;"></i>' +
      'Your cart is empty.<br>Start shopping!</p>';
    if (totalEl) totalEl.textContent = '';
    return;
  }

  var html = '';
  var total = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    total += item.price;

    html +=
      '<div style="display:flex; align-items:center; gap:10px;' +
      '  padding:10px 0; border-bottom:1px solid #2a2a2a;">' +

      /* Checkbox */
      '  <input type="checkbox" class="cart-checkbox"' +
      '    data-id="' + item.id + '"' +
      '    style="width:18px; height:18px; cursor:pointer; accent-color:#e87722;">' +

      /* Item name + price */
      '  <div style="flex:1;">' +
      '    <div style="font-size:0.9rem; font-weight:600;">' + item.name + '</div>' +
      '    <div style="font-size:0.8rem; color:#e87722;">P' + item.price.toFixed(2) + '</div>' +
      '  </div>' +

      /* Quick individual remove button */
      '  <button onclick="removeSingleItem(' + item.id + ')"' +
      '    style="background:transparent; border:none; color:#c0392b;' +
      '           font-size:1rem; cursor:pointer;" title="Remove this item">' +
      '    <i class="fas fa-times-circle"></i>' +
      '  </button>' +

      '</div>';
  }

  list.innerHTML = html;
  if (totalEl) {
    totalEl.textContent = 'Total: P' + total.toFixed(2) +
      '  (' + cart.length + ' item' + (cart.length === 1 ? '' : 's') + ')';
  }
}

/* Open the cart modal */
function openCartModal() {
  buildCartModal();
  renderCartItems();
  var modal   = document.getElementById('cartModal');
  var overlay = document.getElementById('cartOverlay');
  if (modal)   { modal.style.display   = 'flex'; }
  if (overlay) { overlay.style.display = 'block'; }
}

/* Close the cart modal */
function closeCartModal() {
  var modal   = document.getElementById('cartModal');
  var overlay = document.getElementById('cartOverlay');
  if (modal)   modal.style.display   = 'none';
  if (overlay) overlay.style.display = 'none';
}


/* ============================================================
   SECTION 5  –  REMOVE ITEMS
   removeSingleItem   – removes one item immediately (the × button)
   removeSelectedItems – removes all items whose checkbox is ticked
   ============================================================ */

function removeSingleItem(itemId) {
  var cart = getCart();
  cart = cart.filter(function (item) { return item.id !== itemId; });
  saveCart(cart);
  updateCartBadge();
  renderCartItems();
}

function removeSelectedItems() {
  // Collect the IDs of all ticked checkboxes
  var checked = document.querySelectorAll('.cart-checkbox:checked');

  if (checked.length === 0) {
    alert('Please tick the checkbox next to each item you want to remove.');
    return;
  }

  var idsToRemove = [];
  for (var i = 0; i < checked.length; i++) {
    idsToRemove.push(Number(checked[i].getAttribute('data-id')));
  }

  var cart = getCart();
  cart = cart.filter(function (item) {
    return idsToRemove.indexOf(item.id) === -1;
  });

  saveCart(cart);
  updateCartBadge();
  renderCartItems();
}


/* ============================================================
   SECTION 6  –  PROCEED TO PAYMENT
   Closes the modal and goes to payment.html.
   If the cart is empty it warns the customer first.
   ============================================================ */

function proceedToPayment() {
  var cart = getCart();

  if (cart.length === 0) {
    alert('Your cart is empty. Please add products before paying.');
    return;
  }

  closeCartModal();
  window.location.href = 'payment.html';
}


/* ============================================================
   SECTION 7  –  PAYMENT METHOD CHOICE
   Called by each payment card:
     onclick="choosePayment('Visa')"
   Highlights the chosen card and remembers the selection.
   ============================================================ */

var chosenPaymentMethod = ''; // stores 'Visa', 'Mastercard', or 'PayPal'

function choosePayment(method) {
  chosenPaymentMethod = method;

  // Reset all cards to default orange style
  var cards = document.querySelectorAll('.payment-card');
  for (var i = 0; i < cards.length; i++) {
    cards[i].style.border = '3px solid transparent';
    cards[i].style.background = '#e87722';
  }

  // Highlight the one the customer chose
  var allCards = document.querySelectorAll('.payment-card');
  for (var j = 0; j < allCards.length; j++) {
    var heading = allCards[j].querySelector('h3');
    if (heading && heading.textContent.trim().toUpperCase() === method.toUpperCase()) {
      allCards[j].style.border = '3px solid #fff';
      allCards[j].style.background = '#c96010'; // darker to show selected
    }
  }

  // Tell the customer what they picked
  var msg = document.getElementById('paymentMessage');
  if (msg) {
    msg.style.color = '#7ecf88';
    msg.textContent = '✔  ' + method + ' selected. Please fill in your details below.';
  }
}


/* ============================================================
   SECTION 8  –  PAYMENT FORM SUBMIT
   Reads the form, checks all fields, validates the card number,
   and shows a success or error message.
   Called by: onclick="completePayment()"
   ============================================================ */

function completePayment() {
  var msg = document.getElementById('paymentMessage');

  /* ── 1. A payment method must be chosen ── */
  if (!chosenPaymentMethod) {
    showPaymentMessage('Please choose a payment method first (Visa, Mastercard, or PayPal).', false);
    return;
  }

  /* ── 2. Read the form fields ── */
  var holderEl  = document.getElementById('cardHolder');
  var cardNoEl  = document.getElementById('cardNo');
  var expiryEl  = document.getElementById('expiryDate');
  var cvvEl     = document.getElementById('cvv');

  /* PayPal uses email + password instead of card details */
  var isPayPal = (chosenPaymentMethod === 'PayPal');

  var paypalEmailEl = document.getElementById('paypalEmail');
  var paypalPassEl  = document.getElementById('paypalPass');

  /* ── 3. Validate based on chosen method ── */
  if (isPayPal) {

    /* PayPal validation */
    if (!paypalEmailEl || paypalEmailEl.value.trim() === '') {
      showPaymentMessage('Please enter your PayPal email address.', false);
      if (paypalEmailEl) paypalEmailEl.focus();
      return;
    }
    if (!paypalEmailEl.value.includes('@') || !paypalEmailEl.value.includes('.')) {
      showPaymentMessage('Please enter a valid PayPal email (e.g. name@paypal.com).', false);
      paypalEmailEl.focus();
      return;
    }
    if (!paypalPassEl || paypalPassEl.value.trim() === '') {
      showPaymentMessage('Please enter your PayPal password.', false);
      if (paypalPassEl) paypalPassEl.focus();
      return;
    }

  } else {

    /* Card validation (Visa / Mastercard) */
    if (!holderEl || holderEl.value.trim() === '') {
      showPaymentMessage('Please enter the card holder name.', false);
      if (holderEl) holderEl.focus();
      return;
    }

    if (!cardNoEl || cardNoEl.value.trim() === '') {
      showPaymentMessage('Please enter the card number.', false);
      if (cardNoEl) cardNoEl.focus();
      return;
    }

    /* Card number must be 16 digits (spaces ignored) */
    var digits = cardNoEl.value.replace(/\s/g, '');
    if (!/^\d{16}$/.test(digits)) {
      showPaymentMessage('Card number must be exactly 16 digits (no letters).', false);
      cardNoEl.focus();
      return;
    }

    if (!expiryEl || expiryEl.value.trim() === '') {
      showPaymentMessage('Please enter the expiry date (MM/YY).', false);
      if (expiryEl) expiryEl.focus();
      return;
    }

    /* Expiry format: MM/YY */
    if (!/^\d{2}\/\d{2}$/.test(expiryEl.value.trim())) {
      showPaymentMessage('Expiry date format must be MM/YY (e.g. 08/27).', false);
      expiryEl.focus();
      return;
    }

    if (!cvvEl || cvvEl.value.trim() === '') {
      showPaymentMessage('Please enter the CVV number.', false);
      if (cvvEl) cvvEl.focus();
      return;
    }

    /* CVV must be 3 or 4 digits */
    if (!/^\d{3,4}$/.test(cvvEl.value.trim())) {
      showPaymentMessage('CVV must be 3 or 4 digits.', false);
      cvvEl.focus();
      return;
    }
  }

  /* ── 4. All fields are valid – show success ── */
  var cart   = getCart();
  var total  = 0;
  for (var k = 0; k < cart.length; k++) { total += cart[k].price; }

  showPaymentMessage(
    '✔  Payment successful!  ' +
    'Your order total of P' + total.toFixed(2) + ' was paid via ' + chosenPaymentMethod + '.\n' +
    'Your goods are being prepared and will be delivered shortly.  Thank you!',
    true
  );

  /* Clear the cart after successful payment */
  saveCart([]);
  updateCartBadge();

  /* Reset the form */
  var fields = ['cardHolder','cardNo','expiryDate','cvv','paypalEmail','paypalPass'];
  for (var f = 0; f < fields.length; f++) {
    var el = document.getElementById(fields[f]);
    if (el) el.value = '';
  }
  chosenPaymentMethod = '';

  /* Remove selected highlight from payment cards */
  var pcards = document.querySelectorAll('.payment-card');
  for (var p = 0; p < pcards.length; p++) {
    pcards[p].style.border     = '3px solid transparent';
    pcards[p].style.background = '#e87722';
  }
}

/* Helper – show a coloured message below the form */
function showPaymentMessage(text, success) {
  var msg = document.getElementById('paymentMessage');
  if (!msg) return;
  msg.textContent   = text;
  msg.style.color   = success ? '#7ecf88' : '#e74c3c';
  msg.style.background = success ? 'rgba(46,139,87,0.15)' : 'rgba(231,76,60,0.1)';
  msg.style.padding = '10px 14px';
  msg.style.borderRadius = '6px';
  msg.style.marginTop = '16px';
  /* Scroll to message */
  msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


/* ============================================================
   SECTION 9  –  SEARCH BAR
   ============================================================ */

function runSearch() {
  var searchInput = document.querySelector('.search-input');
  if (!searchInput) return;
  var text = searchInput.value.trim();
  if (text === '') {
    alert('Please type a product name to search for.');
    return;
  }
  alert('Searching for: "' + text + '"');
  searchInput.value = '';
}


/* ============================================================
   SECTION 10  –  FEEDBACK FORM SUBMISSION
   ============================================================ */

var selectedRating = 0;

function submitFeedback() {
  var firstName = document.getElementById('firstName');
  var surname   = document.getElementById('surname');
  var email     = document.getElementById('email');
  var subject   = document.getElementById('subject');
  var message   = document.getElementById('message');

  if (!firstName || firstName.value.trim() === '') {
    alert('Please enter your first name.'); if (firstName) firstName.focus(); return;
  }
  if (!surname || surname.value.trim() === '') {
    alert('Please enter your surname.'); if (surname) surname.focus(); return;
  }
  if (!email || email.value.trim() === '') {
    alert('Please enter your email address.'); if (email) email.focus(); return;
  }
  if (!email.value.includes('@') || !email.value.includes('.')) {
    alert('Please enter a valid email (e.g. name@email.com).'); email.focus(); return;
  }
  if (!subject || subject.value.trim() === '') {
    alert('Please enter a subject.'); if (subject) subject.focus(); return;
  }
  if (!message || message.value.trim() === '') {
    alert('Please write your message.'); if (message) message.focus(); return;
  }
  if (selectedRating === 0) {
    alert('Please choose a star rating before submitting.'); return;
  }

  alert(
    'Thank you, ' + firstName.value.trim() + '!\n' +
    'Your feedback has been submitted.\n' +
    'Rating: ' + selectedRating + ' star(s).\n\n' +
    'We will reply to ' + email.value.trim() + ' shortly.'
  );

  firstName.value = ''; surname.value = ''; email.value = '';
  subject.value   = ''; message.value = ''; selectedRating = 0;

  var stars = document.querySelectorAll('.star-rating label');
  for (var i = 0; i < stars.length; i++) {
    stars[i].querySelector('i').className = 'far fa-star';
    stars[i].style.color = '#555';
  }
}


/* ============================================================
   SECTION 11  –  STAR RATING
   ============================================================ */

function setRating(starNumber) {
  selectedRating = starNumber;
  var stars = document.querySelectorAll('.star-rating label');
  for (var i = 0; i < stars.length; i++) {
    var icon    = stars[i].querySelector('i');
    var thisStar = stars.length - i; // labels are stored reversed 5→1
    if (thisStar <= starNumber) {
      icon.className      = 'fas fa-star';
      stars[i].style.color = '#e87722';
    } else {
      icon.className      = 'far fa-star';
      stars[i].style.color = '#555';
    }
  }
}


/* ============================================================
   SECTION 12  –  CLOTHING TABS  (Men / Women / Kids)
   Called by tab buttons: onclick="showClothingSection('men')"
   ============================================================ */

function showClothingSection(id) {
  document.querySelectorAll('.clothing-section').forEach(function (s) {
    s.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  var target = document.getElementById(id);
  if (target) target.classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(function (b) {
    if (b.textContent.trim().toLowerCase().includes(id.toLowerCase())) {
      b.classList.add('active');
    }
  });
}


/* ============================================================
   SECTION 13  –  EQUIPMENT TABS  (Football / Basketball / Tennis)
   Called by tab buttons: onclick="showEquipSection('football')"
   ============================================================ */

function showEquipSection(id) {
  document.querySelectorAll('.equip-section').forEach(function (s) {
    s.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  var target = document.getElementById(id);
  if (target) target.classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(function (b) {
    if (b.textContent.trim().toLowerCase().includes(id.toLowerCase())) {
      b.classList.add('active');
    }
  });
}

/* Keep old name working too (some pages use showEquipmentSection) */
function showEquipmentSection(id) { showEquipSection(id); }


/* ============================================================
   SECTION 14  –  NAVBAR SCROLL SHADOW
   ============================================================ */

window.addEventListener('scroll', function () {
  var navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.style.boxShadow = window.scrollY > 50
      ? '0 4px 14px rgba(0,0,0,0.45)'
      : 'none';
  }
});


/* ============================================================
   SECTION 15  –  PAGE LOAD
   Runs automatically when any page finishes loading.
   ============================================================ */

window.addEventListener('DOMContentLoaded', function () {

  /* ── Update cart badge ── */
  updateCartBadge();

  /* ── Build the cart modal (hidden until the icon is clicked) ── */
  buildCartModal();

  /* ── Cart icon → open modal ── */
  var cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) {
    cartIcon.style.cursor = 'pointer';
    cartIcon.addEventListener('click', openCartModal);
  }

  /* ── Search button ── */
  var searchBtn = document.querySelector('.search-btn');
  if (searchBtn) searchBtn.addEventListener('click', runSearch);

  /* ── Search box Enter key ── */
  var searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter' || e.keyCode === 13) runSearch();
    });
  }

  /* ── Feedback submit button ── */
  var submitBtn = document.querySelector('.btn-submit');
  if (submitBtn) submitBtn.addEventListener('click', submitFeedback);

  /* ── Star rating labels ── */
  var starLabels = document.querySelectorAll('.star-rating label');
  for (var i = 0; i < starLabels.length; i++) {
    (function (label, num) {
      label.addEventListener('click', function () { setRating(num); });
    })(starLabels[i], starLabels.length - i);
  }

  /* ── Payment page: show cart summary ── */
  renderCartSummaryOnPaymentPage();

  /* ── URL hash → open section ── */
  var hash = window.location.hash.replace('#', '');
  if (['men','women','kids'].includes(hash))                showClothingSection(hash);
  if (['football','basketball','tennis'].includes(hash))    showEquipSection(hash);

  /* ── Auto-play videos (muted, required for autoplay in browsers) ── */
  document.querySelectorAll('video').forEach(function (v) {
    v.muted = true;
    v.loop  = true;
    v.play().catch(function () { /* blocked by browser – shows paused controls */ });
  });

  /* ── Payment page: toggle card vs PayPal form fields ── */
  setupPaymentFieldToggle();
});


/* ============================================================
   PAYMENT PAGE HELPERS
   ============================================================ */

/* Shows the cart items as a read-only summary at the top of payment.html */
function renderCartSummaryOnPaymentPage() {
  var summaryEl = document.getElementById('cartSummary');
  if (!summaryEl) return; // not on payment page

  var cart = getCart();
  if (cart.length === 0) {
    summaryEl.innerHTML =
      '<p style="color:#aaa; text-align:center;">No items in cart. ' +
      '<a href="index.html" style="color:#e87722;">Go shopping</a></p>';
    return;
  }

  var html = '<table style="width:100%; border-collapse:collapse; font-size:0.9rem;">' +
    '<tr style="color:#e87722; border-bottom:1px solid #333;">' +
    '<th style="text-align:left; padding:6px 0;">Item</th>' +
    '<th style="text-align:right; padding:6px 0;">Price</th></tr>';

  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    total += cart[i].price;
    html += '<tr style="border-bottom:1px solid #2a2a2a;">' +
      '<td style="padding:6px 0;">' + cart[i].name + '</td>' +
      '<td style="text-align:right; padding:6px 0; color:#e87722;">P' +
      cart[i].price.toFixed(2) + '</td></tr>';
  }

  html += '<tr><td colspan="2" style="padding:10px 0; font-weight:700; color:#e87722; text-align:right;">' +
    'TOTAL:  P' + total.toFixed(2) + '</td></tr></table>';

  summaryEl.innerHTML = html;
}

/* Shows/hides card fields vs PayPal fields depending on chosen method */
function setupPaymentFieldToggle() {
  var cardFields  = document.getElementById('cardFields');
  var paypalFields = document.getElementById('paypalFields');
  if (!cardFields && !paypalFields) return;

  /* Default: show card fields, hide PayPal */
  if (cardFields)  cardFields.style.display  = 'block';
  if (paypalFields) paypalFields.style.display = 'none';
}

/* Called by payment card onclick – also swaps the visible form */
var _origChoosePayment = choosePayment;
choosePayment = function (method) {
  _origChoosePayment(method);

  var cardFields   = document.getElementById('cardFields');
  var paypalFields = document.getElementById('paypalFields');

  if (method === 'PayPal') {
    if (cardFields)   cardFields.style.display   = 'none';
    if (paypalFields) paypalFields.style.display  = 'block';
  } else {
    if (cardFields)   cardFields.style.display   = 'block';
    if (paypalFields) paypalFields.style.display  = 'none';
  }
};

/* ============================================================
   END OF javascript.js

   Link this file on EVERY page, AFTER Bootstrap, just before </body>:
     <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js"></script>
     <script src="javascript.js"></script>
   ============================================================ */


















