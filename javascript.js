/* =========================================
        PROSPORT GEAR WEBSITE
========================================= */

/* =========================================
            SHOPPING CART
========================================= */

// CART STORAGE
let cart =
JSON.parse(localStorage.getItem("cart")) || [];

// PAYMENT METHOD
let selectedPayment = "";

/* =========================================
            SEARCH FUNCTION
========================================= */

function runSearch() {

    // GET SEARCH INPUT
    let searchInput =
    document.querySelector(".search-input");

    // STOP IF INPUT DOES NOT EXIST
    if (!searchInput) return;

    // GET SEARCH VALUE
    let searchText =
    searchInput.value.toLowerCase().trim();

    // EMPTY SEARCH CHECK
    if (searchText === "") {

        alert("Please enter a product name.");

        return;
    }

    /* =========================
            PRODUCT SEARCH
    ========================= */

    // CLOTHING PRODUCTS
    if (
        searchText.includes("vest") ||
        searchText.includes("shorts") ||
        searchText.includes("socks") ||
        searchText.includes("tracksuit") ||
        searchText.includes("hoodie")
    ) {

        window.location.href =
        "clothing.html";
    }

    // FOOTBALL PRODUCTS
    else if (
        searchText.includes("football") ||
        searchText.includes("boots") ||
        searchText.includes("jersey") ||
        searchText.includes("goalkeeper gloves")
    ) {

        window.location.href =
        "equipment.html#football";
    }

    // BASKETBALL PRODUCTS
    else if (
        searchText.includes("basketball") ||
        searchText.includes("basketball shoes")
    ) {

        window.location.href =
        "equipment.html#basketball";
    }

    // TENNIS PRODUCTS
    else if (
        searchText.includes("tennis") ||
        searchText.includes("racket")
    ) {

        window.location.href =
        "equipment.html#tennis";
    }

    // PRODUCT NOT FOUND
    else {

        alert("Product not found.");
    }

    // CLEAR SEARCH BAR
    searchInput.value = "";
}

/* =========================================
            ADD TO CART
========================================= */

function addToCart(name, price) {

    // PRODUCT OBJECT
    let product = {

        name: name,
        price: Number(price)
    };

    // ADD PRODUCT
    cart.push(product);

    // SAVE TO LOCAL STORAGE
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    // UPDATE DISPLAY
    updateCartCount();

    // MESSAGE
    alert(name + " added to shopping cart!");
}

/* =========================================
                BUY NOW
========================================= */

function buyNow(name, price) {

    // ADD PRODUCT
    addToCart(name, price);

    // OPEN CART
    toggleCart();
}

/* =========================================
            CREATE CART SIDEBAR
========================================= */

function createCartSidebar() {

    // CHECK IF EXISTS
    if (
        document.getElementById("cartSidebar")
    ) return;

    // CREATE SIDEBAR
    let sidebar =
    document.createElement("div");

    sidebar.id = "cartSidebar";

    sidebar.style.position = "fixed";
    sidebar.style.top = "0";
    sidebar.style.right = "-420px";
    sidebar.style.width = "350px";
    sidebar.style.height = "100%";
    sidebar.style.background = "#fff";
    sidebar.style.padding = "20px";
    sidebar.style.transition = "0.3s";
    sidebar.style.zIndex = "9999";
    sidebar.style.overflowY = "auto";
    sidebar.style.boxShadow =
    "-3px 0 10px rgba(0,0,0,0.3)";

    // SIDEBAR CONTENT
    sidebar.innerHTML = `

    <h2>Shopping Cart</h2>

    <div id="cart-items"></div>

    <h3 id="cart-total">
        TOTAL: P0
    </h3>

    <button
    onclick="removeSelectedProducts()"
    style="
        background:red;
        color:white;
        border:none;
        padding:10px;
        border-radius:20px;
        margin-top:10px;
        cursor:pointer;
    ">

    Remove Selected

    </button>

    <button
    onclick="goToPayment()"
    style="
        background:green;
        color:white;
        border:none;
        padding:10px;
        border-radius:20px;
        margin-top:10px;
        margin-left:10px;
        cursor:pointer;
    ">

    Proceed To Payment

    </button>

    `;

    // ADD TO PAGE
    document.body.appendChild(sidebar);
}

/* =========================================
            TOGGLE CART
========================================= */

function toggleCart() {

    let sidebar =
    document.getElementById("cartSidebar");

    if (!sidebar) return;

    // CLOSE
    if (sidebar.style.right === "0px") {

        sidebar.style.right = "-420px";
    }

    // OPEN
    else {

        sidebar.style.right = "0px";

        displayCart();
    }
}

/* =========================================
            DISPLAY CART
========================================= */

function displayCart() {

    let cartContainer =
    document.getElementById("cart-items");

    let totalContainer =
    document.getElementById("cart-total");

    if (
        !cartContainer ||
        !totalContainer
    ) return;

    // CLEAR DISPLAY
    cartContainer.innerHTML = "";

    let total = 0;

    // EMPTY CART
    if (cart.length === 0) {

        cartContainer.innerHTML =
        "<p>Your shopping cart is empty.</p>";

        totalContainer.innerHTML =
        "TOTAL: P0";

        return;
    }

    // DISPLAY PRODUCTS
    cart.forEach((item, index) => {

        total += item.price;

        cartContainer.innerHTML += `

        <div style="
            border-bottom:1px solid #ddd;
            padding:12px 0;
        ">

        <input
        type="checkbox"
        class="cart-check"
        data-index="${index}">

        <strong>${item.name}</strong>

        - P${item.price}

        </div>
        `;
    });

    // DISPLAY TOTAL
    totalContainer.innerHTML =
    "TOTAL: P" + total;
}

/* =========================================
        REMOVE SELECTED PRODUCTS
========================================= */

function removeSelectedProducts() {

    // GET CHECKED PRODUCTS
    let selected =
    document.querySelectorAll(
        ".cart-check:checked"
    );

    // NOTHING SELECTED
    if (selected.length === 0) {

        alert(
        "Please select products to remove."
        );

        return;
    }

    let indexes = [];

    // SAVE INDEXES
    selected.forEach((check) => {

        indexes.push(
            Number(check.dataset.index)
        );
    });

    // SORT DESCENDING
    indexes.sort((a, b) => b - a);

    // REMOVE PRODUCTS
    indexes.forEach((index) => {

        cart.splice(index, 1);
    });

    // UPDATE STORAGE
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    // REFRESH DISPLAY
    displayCart();

    updateCartCount();

    // MESSAGE
    alert(
    "Selected products removed."
    );
}

/* =========================================
            CART COUNT
========================================= */

function updateCartCount() {

    let count =
    document.getElementById("cart-count");

    if (count) {

        count.innerHTML =
        cart.length;
    }
}

/* =========================================
            GO TO PAYMENT
========================================= */

function goToPayment() {

    // EMPTY CART CHECK
    if (cart.length === 0) {

        alert(
        "Shopping cart is empty!"
        );

        return;
    }

    // CLOSE SIDEBAR
    let sidebar =
    document.getElementById("cartSidebar");

    if (sidebar) {

        sidebar.style.right = "-420px";
    }

    // OPEN PAYMENT PAGE
    window.location.href =
    "payment.html";
}

/* =========================================
        PAYMENT METHOD SELECTION
========================================= */

function choosePayment(method) {

    // SAVE METHOD
    selectedPayment = method;

    // MESSAGE
    alert(
    method + " selected successfully."
    );
}

/* =========================================
            COMPLETE PAYMENT
========================================= */

function completePayment() {

    // GET INPUTS
    let name =
    document.getElementById("cardName");

    let number =
    document.getElementById("cardNumber");

    let expiry =
    document.getElementById("expiry");

    let cvv =
    document.getElementById("cvv");

    let message =
    document.getElementById(
        "paymentMessage"
    );


    /* =========================
            VALIDATION
    ========================= */

    // CARD NUMBER CHECK
    if (
        number.value.length < 8
    ) {

        message.innerHTML =
        "❌ Invalid card number.";

        message.style.color = "red";

        return;
    }

    // CVV CHECK
    if (
        cvv.value.length < 3
    ) {

        message.innerHTML =
        "❌ Invalid CVV number.";

        message.style.color = "red";

        return;
    }

  /* =========================
            SUCCESS
    ========================= */

    message.innerHTML =
    "✅ Payment successful! Await delivery of your goods.";

    message.style.color =
    "green";

    // CLEAR CART
    cart = [];

    localStorage.removeItem("cart");

    updateCartCount();

    // CLOSE SIDEBAR
    let sidebar =
    document.getElementById("cartSidebar");

    if (sidebar) {

        sidebar.style.right = "-420px";
    }
}


    /* =========================
        EMPTY FIELD CHECK
    ========================= */

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

        alert(
        "Please complete all payment fields."
        );

        message.innerHTML =
        "❌ Wrong or incomplete payment details.";

        message.style.color = "red";

        return;
    }


/* =========================================
            CLOTHING TABS
========================================= */

function showClothingSection(sectionId) {

    // GET ALL SECTIONS
    let sections =
    document.querySelectorAll(
        ".clothing-section"
    );

    // HIDE SECTIONS
    sections.forEach((section) => {

        section.classList.remove(
            "active"
        );
    });

    // SHOW SELECTED
    let target =
    document.getElementById(
        sectionId
    );

    if (target) {

        target.classList.add(
            "active"
        );
    }
}

/* =========================================
            EQUIPMENT TABS
========================================= */

function showEquipSection(sectionId) {

    // GET SECTIONS
    let sections =
    document.querySelectorAll(
        ".equip-section"
    );

    // HIDE ALL
    sections.forEach((section) => {

        section.classList.remove(
            "active"
        );
    });

    // SHOW TARGET
    let target =
    document.getElementById(
        sectionId
    );

    if (target) {

        target.classList.add(
            "active"
        );
    }
}

/* =========================================
            FEEDBACK FORM
========================================= */

function submitFeedback() {

    // GET INPUTS
    let firstName =
    document.getElementById(
        "firstName"
    );

    let surname =
    document.getElementById(
        "surname"
    );

    let email =
    document.getElementById(
        "email"
    );

    let subject =
    document.getElementById(
        "subject"
    );

    let message =
    document.getElementById(
        "message"
    );

    /* =========================
            VALIDATION
    ========================= */

    if (

        !firstName ||
        !surname ||
        !email ||
        !subject ||
        !message ||

        firstName.value.trim() === "" ||
        surname.value.trim() === "" ||
        email.value.trim() === "" ||
        subject.value.trim() === "" ||
        message.value.trim() === ""

    ) {

        alert(
        "Please complete all feedback fields."
        );

        return;
    }

    // SUCCESS MESSAGE
    alert(
    "Feedback submitted successfully!"
    );

    // CLEAR FORM
    firstName.value = "";
    surname.value = "";
    email.value = "";
    subject.value = "";
    message.value = "";
}

/* =========================================
            PAGE LOAD
========================================= */

document.addEventListener(
"DOMContentLoaded",
function () {

    // CREATE CART
    createCartSidebar();

    // UPDATE CART
    updateCartCount();

    // DISPLAY PRODUCTS
    displayCart();

    /* =========================
            SEARCH BUTTON
    ========================= */

    let searchBtn =
    document.querySelector(
        ".search-btn"
    );

    if (searchBtn) {

        searchBtn.addEventListener(
            "click",
            runSearch
        );
    }

    /* =========================
            CART ICON
    ========================= */

    let cartIcon =
    document.querySelector(
        ".cart-icon"
    );

    if (cartIcon) {

        cartIcon.addEventListener(
            "click",
            toggleCart
        );
    }
});
