/* =========================================
            PROSPORT GEAR WEBSITE
========================================= */

/* =========================
        SHOPPING CART
========================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedPayment = "";


/* =========================
     SEARCH BAR
========================= */
 
/* These lists map keywords to pages and sections */
const clothingKeywords = [
    "vest","shorts","socks","jersey","tracksuit","cap",
    "hoodie","polo","sweatband","windbreaker","leggings",
    "joggers","arm sleeves","sports bra","jacket","skirt",
    "dress","tops","compression"
];
 
const footballKeywords = [
    "whistle","football","boots","shin guards","gk gloves",
    "cones","goal net","ball pump","scoreboard","bibs",
    "corner flags","stretcher","referee cards","stopwatch","hurdles",
    "agility ladder","pump","flags","cards"
];
 
const basketballKeywords = [
    "basketball","net","shoes","hoop","knee pads","headband",
    "ball bag","wristband","mouthguard","first aid","water bottle",
    "mannequin","clock","game clock"
];
 
const tennisKeywords = [
    "racket","tennis","dampener","grip tape","elbow brace",
    "ball machine","umpire","scoreboard","line markers",
    "basket","ladder","cones"
];
 
function runSearch() {
 
    let searchInput = document.querySelector(".search-input");
 
    if (!searchInput) return;
 
    let searchText = searchInput.value.trim().toLowerCase();
 
    if (searchText === "") {
        alert("Please type a product name to search for.");
        return;
    }
 
    /* Check clothing */
    let isClothing = clothingKeywords.some(
        (word) => searchText.includes(word)
    );
 
    /* Check equipment categories */
    let isFootball   = footballKeywords.some(
        (word) => searchText.includes(word)
    );
 
    let isBasketball = basketballKeywords.some(
        (word) => searchText.includes(word)
    );
 
    let isTennis     = tennisKeywords.some(
        (word) => searchText.includes(word)
    );
 
    let isEquipment  = isFootball || isBasketball || isTennis;
 
    /* Navigate to the right page */
    if (isClothing) {
 
        alert("Found matching clothing. Taking you there now...");
        window.location.href = "clothing.html";
 
    } else if (isFootball) {
 
        alert("Found matching football equipment. Taking you there now...");
        window.location.href = "equipment.html#football";
 
    } else if (isBasketball) {
 
        alert("Found matching basketball equipment. Taking you there now...");
        window.location.href = "equipment.html#basketball";
 
    } else if (isTennis) {
 
        alert("Found matching tennis equipment. Taking you there now...");
        window.location.href = "equipment.html#tennis";
 
    } else {
 
        /* Not found in our lists – show a message */
        alert('Searching for: "' + searchText + '".\nNo exact match found. Showing all products.');
        window.location.href = "clothing.html";
    }
 
    searchInput.value = "";
}


/* =========================
        ADD TO CART
========================= */

function addToCart(name, price) {

    /* Create a product object with a unique id so we can remove it later */        
    let product = {
        id: Date.now(),    
        name: name,
        price: Number(price)
    };

    cart.push(product);

    /* Save updated cart to lacalStorage */        
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    /* Tells the customer the item that was added */         
    alert(name + price + " added to shopping cart!");
}


/* ==============================================
            CREATE CART SIDEBAR
Building a sliding panel that opens from the right
window of the screen when the cart icon is clicked.
It lists all the items in the shopping cart with
checkboxes.
================================================== */

function createCartSidebar() {

    if (document.getElementById("cartSidebar")) return;

    let html = `
    
    <div id="cartSidebar"
    style="
        font-family: san-serif;        
        position: fixed;
        top: 0;
        right: -420px;
        width: 380px;
        height: 100%;
        background: white;
        z-index: 9999;
        transition: 0.3s;
        overflow-y: auto;
        padding: 20px;
        box-shadow: -4px 0 10px rgba(0,0,0,0.3);
    <!-- HEADER ROW -->
        <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        ">
            <h3 style="color:#4a6741; margin:0;">
                <i class="fas fa-shopping-cart"
                   style="margin-right:8px;"></i>
                Shopping Cart
            </h3>
 
            <button onclick="toggleCart()"
            style="
                background: #e87722;
                color: white;
                border: none;
                padding: 6px 14px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
            ">
                Close ✕
            </button>
        </div>
 
        <!-- ITEM LIST (filled by displayCart) -->
        <div id="cart-items"></div>
 
        <!-- TOTAL -->
        <h4 id="cart-total"
        style="
            margin-top: 20px;
            color: #4a6741;
            font-size: 1rem;
        ">
            TOTAL: P0
        </h4>
 
        <!-- ACTION BUTTONS -->
        <div style="
            margin-top: 16px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        ">
 
            <button onclick="removeSelectedProducts()"
            style="
                background: #c0392b;
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 700;
            ">
                <i class="fas fa-trash-alt"
                   style="margin-right:6px;"></i>
                Remove Selected
            </button>
 
            <button onclick="goToPayment()"
            style="
                background: #4a6741;
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
                font-weight: 700;
            ">
                <i class="fas fa-credit-card"
                   style="margin-right:6px;"></i>
                Proceed to Payment
            </button>
 
        </div>
 
    </div>
 
    <!-- DARK OVERLAY behind the sidebar -->
    <div id="cartOverlay"
    onclick="toggleCart()"
    style="
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 9998;
    "></div>
    `;

    document.body.insertAdjacentHTML("beforeend", html);
}

/* =========================
        TOGGLE CART
========================= */

function toggleCart() {

    let sidebar = document.getElementById("cartSidebar");
    let overlay = document.getElementById("cartOverlay");  
            
    if (!sidebar) return;

    let isOpen = sidebar.style.right === "0px";
 
    if (isOpen) {
 
        /* Close */
        sidebar.style.right  = "-420px";
        overlay.style.display  = "none";
 
    } else {
 
        /* Open and refresh the list */
        sidebar.style.right    = "0px";
        overlay.style.display  = "block";
        displayCart();
    }
}        

               
/* =========================
        DISPLAY CART
========================= */

function displayCart() {

    let cartContainer = document.getElementById("cart-items");
    let totalEl = document.getElementById("cart-total");

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

       container.innerHTML =
            "<p style='color:#888; text-align:center; margin-top:20px;'>" +
            "Your cart is empty.</p>";
 
        if (totalEl) totalEl.textContent = "TOTAL: P0";
 
        return;
    }
 
    cart.forEach((item, index) => {
 
        total += item.price;
 
        container.innerHTML += `
 
        <div style="
            border-bottom: 1px solid #ddd;
            padding: 12px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        ">
            <!-- Checkbox to select for removal -->
            <input
                type="checkbox"
                class="cart-check"
                data-index="${index}"
                style="width:18px; height:18px; cursor:pointer; accent-color:#e87722;">
 
            <div style="flex:1;">
                <strong>${item.name}</strong><br>
                <span style="color:#e87722; font-size:0.9rem;">
                    P${item.price}
                </span>
            </div>
 
            <!-- Quick single-item remove button -->
            <button
                onclick="removeSingleItem(${index})"
                style="
                    background: transparent;
                    border: none;
                    color: #c0392b;
                    font-size: 1.1rem;
                    cursor: pointer;
                "
                title="Remove this item">
                ✕
            </button>
 
        </div>
        `;
    });
 
    if (totalEl) totalEl.textContent = "TOTAL: P" + total.toFixed(2);
}

/* =========================
   REMOVE A SINGLE ITEM
========================= */
 
function removeSingleItem(index) {
 
    cart.splice(index, 1);
 
    localStorage.setItem("cart", JSON.stringify(cart));
 
    updateCartCount();
 
    displayCart();
}
   

/* =========================
    REMOVE SELECTED PRODUCTS
========================= */

function removeSelectedProducts() {

    let checked = document.querySelectorAll(".cart-check:checked");

    if (checked.length === 0) {

        alert("Please tick the checkbox next to the items you want to remove.");

        return;
    }

    /* Collects indexes of ticked items */        
    let indexes = [];

    checked.forEach((box) => {
        indexes.push(Number(box.dataset.index));
    });

    indexes.sort((a, b) => b - a);

    indexes.forEach((index) =>  cart.splice(index, 1));
    

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    displayCart();        

    alert("Selected items removed from the cart.");
}

/* =========================
        CART COUNT
========================= */
function updateCartCount() {
 
    let cartIcon = document.querySelector(".cart-icon");
 
    if (!cartIcon) return;
 
    /* Try to find the badge; create it if missing */
    let badge = document.getElementById("cart-badge");
 
    if (!badge) {
 
        badge = document.createElement("span");
        badge.id = "cart-badge";
 
        /* Style: small red circle sitting on top of the icon */
        badge.style.cssText =
            "position:absolute;" +
            "top:-8px;" +
            "right:-8px;" +
            "background:red;" +
            "color:white;" +
            "border-radius:50%;" +
            "width:20px;" +
            "height:20px;" +
            "font-size:0.68rem;" +
            "font-weight:bold;" +
            "display:flex;" +
            "align-items:center;" +
            "justify-content:center;" +
            "pointer-events:none;";
 
        /* The parent <li> needs position:relative so the
           badge sits in the right place */
        let parentLi = cartIcon.parentElement;
        parentLi.style.position = "relative";
        parentLi.appendChild(badge);
    }
 
    badge.textContent   = cart.length;
    badge.style.display = cart.length > 0 ? "flex" : "none";
}
 

/* =========================
        PAYMENT PAGE
========================= */

function goToPayment() {

    if (cart.length === 0) {

        alert("Your cart is empty! Please add products first.");
        return;
    }

    /* Save cart total so payment page can show the amount */
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    localStorage.setItem("cartTotal", total.toFixed(2));
 
    /* Empty the cart (remove from storage) */
    cart = [];
    localStorage.removeItem("cart");
 
    /* Update badge to 0 */
    updateCartCount();
 
    /* Close sidebar */
    let sidebar = document.getElementById("cartSidebar");
    let overlay = document.getElementById("cartOverlay");
    if (sidebar) sidebar.style.right   = "-420px";
    if (overlay) overlay.style.display = "none";
 
    /* Go to payment page */
    window.location.href = "payment.html";
}
            

/* =========================
    SELECT PAYMENT OPTION
========================= */

function choosePayment(method) {

    selectedPayment = method;

    /* Reset all cards */
    document.querySelectorAll(".payment-card").forEach((card) => {
        card.style.border     = "3px solid transparent";
        card.style.background = "#e87722";
    });
 
    /* Highlight the chosen one */
    document.querySelectorAll(".payment-card").forEach((card) => {
        let heading = card.querySelector("h3");
        if (heading &&
            heading.textContent.trim().toUpperCase() === method.toUpperCase()) {
            card.style.border     = "3px solid #fff";
            card.style.background = "#c96010";
        }
    });
 
    /* Update message area if it exists */
    let msg = document.getElementById("paymentMessage");
    if (msg) {
        msg.style.color = "#7ecf88";
        msg.textContent =  method + " selected. Fill in your details below.";
    }
 
    /* Show/hide card vs PayPal fields */
    let cardFields   = document.getElementById("cardFields");
    let paypalFields = document.getElementById("paypalFields");
 
    if (method === "PayPal") {
        if (cardFields)   cardFields.style.display  = "none";
        if (paypalFields) paypalFields.style.display = "block";
    } else {
        if (cardFields)   cardFields.style.display  = "block";
        if (paypalFields) paypalFields.style.display = "none";
    }
}

/* =========================
    COMPLETE PAYMENT
========================= */

function completePayment() {

   let msg = document.getElementById("paymentMessage");
 
    /* A payment method must be chosen first */
    if (!selectedPayment) {
        showPayMsg("Please choose a payment method first (Visa, Mastercard or PayPal).", false);
        return;
    }
 
    if (selectedPayment === "PayPal") {
 
        /* PayPal fields */
        let email = document.getElementById("paypalEmail");
        let pass  = document.getElementById("paypalPass");
 
        if (!email || email.value.trim() === "") {
            showPayMsg("Please enter your PayPal email address.", false);
            if (email) email.focus();
            return;
        }
 
        if (!email.value.includes("@") || !email.value.includes(".")) {
            showPayMsg("Please enter a valid PayPal email (e.g. name@paypal.com).", false);
            email.focus();
            return;
        }
 
        if (!pass || pass.value.trim() === "") {
            showPayMsg("Please enter your PayPal password.", false);
            if (pass) pass.focus();
            return;
        }
 
    } else {
 
        /* Card fields (Visa / Mastercard) */
        let cardName = document.getElementById("cardName");
        let cardNum  = document.getElementById("cardNumber");
        let expiry   = document.getElementById("expiry");
        let cvv      = document.getElementById("cvv");
 
        if (!cardName || cardName.value.trim() === "") {
            showPayMsg("Please enter the card holder name.", false);
            if (cardName) cardName.focus();
            return;
        }
 
        if (!cardNum || cardNum.value.trim() === "") {
            showPayMsg("Please enter the card number.", false);
            if (cardNum) cardNum.focus();
            return;
        }
 
        /* Card number must be 16 digits */
        let digits = cardNum.value.replace(/\s/g, "");
        if (!/^\d{16}$/.test(digits)) {
            showPayMsg(" Incorrect account details. Card number must be 16 digits.", false);
            cardNum.focus();
            return;
        }
 
        if (!expiry || expiry.value.trim() === "") {
            showPayMsg("Please enter the expiry date (MM/YY).", false);
            if (expiry) expiry.focus();
            return;
        }
 
        if (!/^\d{2}\/\d{2}$/.test(expiry.value.trim())) {
            showPayMsg(" Incorrect account details. Expiry must be MM/YY (e.g. 08/27).", false);
            expiry.focus();
            return;
        }
 
        if (!cvv || cvv.value.trim() === "") {
            showPayMsg("Please enter the CVV.", false);
            if (cvv) cvv.focus();
            return;
        }
 
        if (!/^\d{3,4}$/.test(cvv.value.trim())) {
            showPayMsg(" Incorrect account details. CVV must be 3 or 4 digits.", false);
            cvv.focus();
            return;
        }
    }
 
    /* ── All details correct – show SUCCESS ── */
    let savedTotal = localStorage.getItem("cartTotal") || "0.00";
 
    showPayMsg(
        " Transaction complete!  " +
        "Payment of P" + savedTotal + " via " + selectedPayment +
        " was successful.\n" +
        "Your goods are being prepared. Await delivery — thank you!",
        true
    );
 
    /* Clear everything */
    localStorage.removeItem("cartTotal");
    selectedPayment = "";
 
    /* Reset all form fields */
    ["cardName","cardNumber","expiry","cvv","paypalEmail","paypalPass"]
        .forEach((id) => {
            let el = document.getElementById(id);
            if (el) el.value = "";
        });
 
    /* Reset payment card highlights */
    document.querySelectorAll(".payment-card").forEach((card) => {
        card.style.border     = "3px solid transparent";
        card.style.background = "#e87722";
    });
}
 
/* Helper: show coloured message under the form */
function showPayMsg(text, success) {
 
    let msg = document.getElementById("paymentMessage");
 
    if (!msg) {
        alert(text);
        return;
    }
 
    msg.textContent = text;
    msg.style.color = success ? "#2ecc71" : "#e74c3c";
    msg.style.background = success
        ? "rgba(46,204,113,0.12)"
        : "rgba(231,76,60,0.1)";
    msg.style.padding = "12px 16px";
    msg.style.borderRadius = "6px";
    msg.style.marginTop = "16px";
    msg.style.fontWeight = "700";
    msg.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* =========================
        CLOTHING TABS
========================= */

function showClothingSection(sectionId) {

   document.querySelectorAll(".clothing-section")
        .forEach((s) => s.classList.remove("active"));
 
    let target = document.getElementById(sectionId);
    if (target) target.classList.add("active");
 
    /* Highlight the matching tab button */
    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.remove("active");
        if (btn.textContent.trim().toLowerCase().includes(sectionId.toLowerCase())) {
            btn.classList.add("active");
        }
    }); 
}

/* =========================
        EQUIPMENT TABS
========================= */

function showEquipSection(sectionId) {

   document.querySelectorAll(".equip-section")
        .forEach((s) => s.classList.remove("active"));
 
    let target = document.getElementById(sectionId);
    if (target) target.classList.add("active");
 
    /* Highlight the matching tab button */
    document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.remove("active");
        if (btn.textContent.trim().toLowerCase().includes(sectionId.toLowerCase())) {
            btn.classList.add("active");
        }
    }); 
}

/* =========================
        FEEDBACK FORM
========================= */

function submitFeedback() {

    let firstName =
    document.getElementById("firstName");

    let surname =
    document.getElementById("surname");

    let email =
    document.getElementById("email");

    let subject =
    document.getElementById("subject");

    let message =
    document.getElementById("message");

     if (!firstName || firstName.value.trim() === "") {
        alert("Please enter your first name."); if (firstName) firstName.focus(); return;
    }
    if (!surname || surname.value.trim() === "") {
        alert("Please enter your surname."); if (surname) surname.focus(); return;
    }
    if (!email || email.value.trim() === "") {
        alert("Please enter your email address."); if (email) email.focus(); return;
    }
    if (!email.value.includes("@") || !email.value.includes(".")) {
        alert("Please enter a valid email (e.g. name@email.com)."); email.focus(); return;
    }
    if (!subject || subject.value.trim() === "") {
        alert("Please enter a subject."); if (subject) subject.focus(); return;
    }
    if (!message || message.value.trim() === "") {
        alert("Please write your message."); if (message) message.focus(); return;
    }
 
    alert(" Feedback submitted! Thank you, " + firstName.value.trim() + ".");

    /* Clear the fields */        
    firstName.value = "";
    surname.value   = "";
    email.value     = "";
    subject.value   = "";
    message.value   = "";
}        

}

/* =========================
        PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", function () {

     /* Creates the sliding cart sidebar */
    createCartSidebar();
 
    /* Show badge count (from stored cart) */
    updateCartCount();
 
    /* Search button click */
    let searchBtn = document.querySelector(".search-btn");
    if (searchBtn) {
        searchBtn.addEventListener("click", runSearch);
    }
 
    /* Press Enter in the search box */
    let searchInput = document.querySelector(".search-input");
    if (searchInput) {
        searchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter" || e.keyCode === 13) runSearch();
        });
    }
 
    /* Cart icon opens the sidebar */
    let cartIcon = document.querySelector(".cart-icon");
    if (cartIcon) {
        cartIcon.addEventListener("click", toggleCart);
    }
 
    /* Feedback submit button */
    let submitBtn = document.querySelector(".btn-submit");
    if (submitBtn) {
        submitBtn.addEventListener("click", submitFeedback);
    }
 
    /* URL hash → open the right section automatically.
       Example: visiting clothing.html#women opens Women tab */
    let hash = window.location.hash.replace("#", "");
 
    if (["men","women","kids"].includes(hash)) {
        showClothingSection(hash);
    }
 
    if (["football","basketball","tennis"].includes(hash)) {
        showEquipSection(hash);
    }
 
    /* Show cart total saved from previous page (payment page) */
    let savedTotal = localStorage.getItem("cartTotal");
    let totalEl    = document.getElementById("orderTotal");
    if (savedTotal && totalEl) {
        totalEl.textContent = "P" + savedTotal;
    }
 
    /* Auto-play videos silently (browsers require muted for autoplay) */
    document.querySelectorAll("video").forEach((v) => {
        v.muted = true;
        v.loop  = true;
        v.play().catch(() => { /* blocked by browser — controls still work */ });
    });
});
 









