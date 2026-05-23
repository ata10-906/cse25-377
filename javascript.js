/* =========================
   SHOPPING CART SYSTEM
========================= */

// CART ARRAY
let cart =
JSON.parse(localStorage.getItem("cart")) || [];

/* =========================
   ADD PRODUCT TO CART
========================= */

function addToCart(name, price){

    let product = {
        name:name,
        price:price
    };

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert(name + " added to shopping cart!");
}

/* =========================
   DISPLAY CART PRODUCTS
========================= */

function displayCart(){

    let cartContainer =
    document.getElementById("cart-items");

    let totalContainer =
    document.getElementById("cart-total");

    if(!cartContainer) return;

    cartContainer.innerHTML = "";

    let total = 0;

    // LOOP PRODUCTS
    cart.forEach((item,index)=>{

        total += item.price;

        cartContainer.innerHTML += `

        <div class="cart-product">

            <div>

                <input type="checkbox">

                <strong>${item.name}</strong>

                - P${item.price}

            </div>

            <button
            class="remove-btn"
            onclick="removeProduct(${index})">

            Remove

            </button>

        </div>
        `;
    });

    totalContainer.innerHTML =
    "TOTAL: P" + total;
}

/* =========================
   REMOVE PRODUCT
========================= */

function removeProduct(index){

    cart.splice(index,1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();
}

/* =========================
   PROCEED TO PAYMENT
========================= */

function goToPayment(){

    if(cart.length === 0){

        alert("Shopping cart is empty!");

        return;
    }

    window.location.href =
    "payment.html";
}

/* =========================
   SELECT PAYMENT OPTION
========================= */

let selectedPayment = "";

function choosePayment(method){

    selectedPayment = method;

    alert(method + " selected");
}

/* =========================
   COMPLETE PAYMENT
========================= */

function completePayment(){

    let name =
    document.getElementById("cardName").value;

    let number =
    document.getElementById("cardNumber").value;

    let expiry =
    document.getElementById("expiry").value;

    let cvv =
    document.getElementById("cvv").value;

    let message =
    document.getElementById("paymentMessage");

    // VALIDATION
    if(
        name === "" ||
        number === "" ||
        expiry === "" ||
        cvv === "" ||
        selectedPayment === ""
    ){

        message.innerHTML =
        "❌ Wrong or incomplete account details.";

        message.style.color = "red";

        return;
    }

    // SUCCESS
    message.innerHTML =
    "✅ Payment successful! Await delivery of your goods.";

    message.style.color = "lightgreen";

    // CLEAR CART
    localStorage.removeItem("cart");

    cart = [];
}

/* =========================
   AUTO LOAD CART
========================= */

document.addEventListener(
"DOMContentLoaded",
function(){

    displayCart();

});


















