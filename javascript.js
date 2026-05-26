/* =========================================
            PROSPORT GEAR WEBSITE
========================================= */

/* =========================
        SHOPPING CART
========================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedPayment = "";

/* =========================
        SEARCH FUNCTION
========================= */

function runSearch() {

    let searchInput = document.querySelector(".search-input");

    if (!searchInput) return;

    let searchText = searchInput.value.trim();

    if (searchText === "") {
        alert("Please enter a product to search for.");
        return;
    }

    alert("Searching for: " + searchText);

    searchInput.value = "";
}

/* =========================
        ADD TO CART
========================= */

function addToCart(name, price) {

    let product = {
        name: name,
        price: Number(price)
    };

    cart.push(product);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();

    alert(name + " added to shopping cart!");
}

/* =========================
        BUY NOW
========================= */

function buyNow(name, price) {

    addToCart(name, price);

    toggleCart();
}

/* =========================
        CREATE CART
========================= */

function createCartSidebar() {

    if (document.getElementById("cartSidebar")) return;

    let cartHTML = `
    
    <div id="cartSidebar"
    style="
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
    ">

        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:20px;
        ">

            <h3 style="color:#4a6741;">
                Shopping Cart
            </h3>

            <button onclick="toggleCart()"
            style="
                background:#e87722;
                color:white;
                border:none;
                padding:6px 12px;
                border-radius:6px;
                cursor:pointer;
            ">
                Close
            </button>

        </div>

        <div id="cart-items"></div>

        <h4 id="cart-total"
        style="
            margin-top:20px;
            color:#4a6741;
        ">
            TOTAL: P0
        </h4>

        <div style="
            margin-top:20px;
            display:flex;
            gap:10px;
            flex-wrap:wrap;
        ">

            <button onclick="removeSelectedProducts()"
            style="
                background:red;
                color:white;
                border:none;
                padding:10px;
                border-radius:6px;
                cursor:pointer;
            ">
                Remove Selected
            </button>

            <button onclick="goToPayment()"
            style="
                background:#4a6741;
                color:white;
                border:none;
                padding:10px;
                border-radius:6px;
                cursor:pointer;
            ">
                Proceed
            </button>

        </div>

    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", cartHTML);
}

/* =========================
        TOGGLE CART
========================= */

function toggleCart() {

    let sidebar = document.getElementById("cartSidebar");

    if (!sidebar) return;

    if (sidebar.style.right === "0px") {
        sidebar.style.right = "-420px";
    } else {
        sidebar.style.right = "0px";
        displayCart();
    }
}

/* =========================
        DISPLAY CART
========================= */

function displayCart() {

    let cartContainer = document.getElementById("cart-items");
    let totalContainer = document.getElementById("cart-total");

    if (!cartContainer || !totalContainer) return;

    cartContainer.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <p>Your shopping cart is empty.</p>
        `;

        totalContainer.innerHTML = "TOTAL: P0";

        return;
    }

    cart.forEach((item, index) => {

        total += item.price;

        cartContainer.innerHTML += `
        
        <div style="
            border-bottom:1px solid #ddd;
            padding:12px 0;
        ">

            <input type="checkbox"
            class="cart-check"
            data-index="${index}">

            <strong>${item.name}</strong>

            - P${item.price}

        </div>
        `;
    });

    totalContainer.innerHTML = "TOTAL: P" + total;
}

/* =========================
    REMOVE SELECTED PRODUCTS
========================= */

function removeSelectedProducts() {

    let selected = document.querySelectorAll(".cart-check:checked");

    if (selected.length === 0) {

        alert("Please select products to remove.");

        return;
    }

    let indexes = [];

    selected.forEach((check) => {
        indexes.push(Number(check.dataset.index));
    });

    indexes.sort((a, b) => b - a);

    indexes.forEach((index) => {
        cart.splice(index, 1);
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();

    updateCartCount();

    alert("Selected products removed.");
}

/* =========================
        CART COUNT
========================= */

function updateCartCount() {

    let count = document.getElementById("cart-count");

    if (count) {
        count.innerHTML = cart.length;
    }
}

/* =========================
        PAYMENT PAGE
========================= */

function goToPayment() {

    if (cart.length === 0) {

        alert("Shopping cart is empty!");

        return;
    }

    window.location.href = "payment.html";
}

/* =========================
    SELECT PAYMENT OPTION
========================= */

function choosePayment(method) {

    selectedPayment = method;

    alert(method + " selected successfully.");
}

/* =========================
    COMPLETE PAYMENT
========================= */

function completePayment() {

    let name = document.getElementById("cardName");
    let number = document.getElementById("cardNumber");
    let expiry = document.getElementById("expiry");
    let cvv = document.getElementById("cvv");

    let message = document.getElementById("paymentMessage");

    if (
        !name ||
        !number ||
        !expiry ||
        !cvv ||
        name.value.trim() === "" ||
        number.value.trim() === "" ||
        expiry.value.trim() === "" ||
        cvv.value.trim() === "" ||
        selectedPayment === ""
    ) {

        message.innerHTML =
        "✅ Transaction complete. Await delivery of goods.";    

        message.style.color = "lightgreen";

        return;
    }

    message.innerHTML =
    "❌ Incorrect or incomplete account details.";        

    message.style.color = "red";

    localStorage.removeItem("cart");

    cart = [];

    updateCartCount();

    displayCart();

    name.value = "";
    number.value = "";
    expiry.value = "";
    cvv.value = "";
}

/* =========================
        CLOTHING TABS
========================= */

function showClothingSection(sectionId) {

    let sections =
    document.querySelectorAll(".clothing-section");

    sections.forEach((section) => {
        section.classList.remove("active");
    });

    let target = document.getElementById(sectionId);

    if (target) {
        target.classList.add("active");
    }
}

/* =========================
        EQUIPMENT TABS
========================= */

function showEquipSection(sectionId) {

    let sections =
    document.querySelectorAll(".equip-section");

    sections.forEach((section) => {
        section.classList.remove("active");
    });

    let target = document.getElementById(sectionId);

    if (target) {
        target.classList.add("active");
    }
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

    if (
        firstName.value.trim() === "" ||
        surname.value.trim() === "" ||
        email.value.trim() === "" ||
        subject.value.trim() === "" ||
        message.value.trim() === ""
    ) {

        alert("Please complete all fields.");

        return;
    }

    alert("Feedback submitted successfully!");

    firstName.value = "";
    surname.value = "";
    email.value = "";
    subject.value = "";
    message.value = "";
}

/* =========================
        PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", function () {

    createCartSidebar();

    updateCartCount();

    displayCart();

    let searchBtn =
    document.querySelector(".search-btn");

    if (searchBtn) {
        searchBtn.addEventListener("click", runSearch);
    }

    let cartIcon =
    document.querySelector(".cart-icon");

    if (cartIcon) {
        cartIcon.addEventListener("click", toggleCart);
    }
});










