
/* ============================================================
                        SEARCH BAR
   ============================================================ */

function runSearch() {
  // Get the search input field
  var searchInput = document.querySelector(".search-input");

  // Read the text the user typed (trim removes extra spaces)
  var searchText = searchInput.value.trim();

  // If the box is empty, remind the user to type something
  if (searchText === "") {
    alert("Please enter a product to search for.");
    return; // Stop here, do not continue
  }

  // Show what was searched (replace this with real search logic later)
  alert('Searching for: "' + searchText + '"');

  // Clear the search box after searching
  searchInput.value = "";
}

/* ===============================================================
                        SHOPPING CART 
================================================================ */

//CART ARRAY
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* =============================================================
                     ADD PRODUCT TO CART
============================================================= */
function addToCart(name, price) {
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

/* ==============================================================
                     DISPLAY CART PRODUCTS
============================================================== */
fuction displayCart() {
   let cartContainer = document.getElementById("cart-items");

   let totalContainer = document.getElementById("cart-total");

   if (!cartContainer) return;

   cartContainer.innerHTML = "";

   let total = 0;

   //LOOP PRODUCTS
   cart.forEach((item,index) => {
      total += item.price;
      cartContainer.innerHTML +=

      <div class="cart-product">
          <div>
               <input type="checkbox">
               <strong>${item.name}</strong>
               - P${item.price}
         </div>

         <button class="remove-btn" onclick="removeProduct(${index})">
         Remove
         </button>
      </div>
      
   });
   
   totalContainer.innerHTML = "TOTAL: P" + total; 
}


/*=========================================
          REMOVE A PRODUCT
========================================= */

function removeProduct(index) {
   cart.splice(index,1);

   localStorage.setItem("cart", JSON.stringify(cart));

   displayCart();
}

/* ==========================================
      PROCEED TO PAYMENT
========================================== */
function goToPayment() {
   if (cart.length === 0) {
      alert ("Shopping cart is empty!");

      return;
   }

   window.location.href = "payment.html";
}

/* ==========================================
       SELECT PAYMENT OPTION
========================================= */
let selectPayment = "";
function choosePaymenr(method) {
   selectedPayment = method;
   alert (method + " selected");
}

/* =========================================
      COMPLETE THE PAYMENT
========================================= */
function completePayment() {
   let name = document.getElementById("cardName").value;

   let number = document.getElemenById("cadNumber").value;

   let expiry = document.getElementById("expiry").value;

   let cvv = document.getElementaryById("cvv").value;

   let message = document.getElementById("paymentMessage").value;

   //VALIDATION
   if (
      name === "" ||
      number === "" ||
      expiry === "" ||
      cvv === "" ||
      selectedPayment === "" 
   ){

      message.innerHTML = "❌ WRONG OR INCOMPLETE ACCOUNT DETAILS.";
      message.style.color = "red";

      return;
      
   }

   //SUCCESSFUL TRANSACTION
   message.innerHTML = "✅ PAYMENT SUCCESSFUL AWAIT DELIVERY OF GOODS";
   message.style.color = "lightgreen";

   //CLEAR THE SHOPPING CART
   localStorage.removeItem("cart");
   cart = [];
}


/* ===========================================
            AUTO LOAD THE CART
========================================== */
document.addEventListener("DOMContentLoaded", function() {
   displayCart();
}); 


/* ============================================================
    CLOTHING PAGE: SECTION TABS (Men / Women / Kids)
   Shows one section at a time when a tab button is clicked.
   ============================================================ */

function showClothingSection(sectionId) {
  // Hide ALL clothing sections first
  var allSections = document.querySelectorAll(".clothing-section");
  for (var i = 0; i < allSections.length; i++) {
    allSections[i].classList.remove("active");
  }

  // Remove the active style from ALL tab buttons
  var allTabs = document.querySelectorAll(".tab-btn");
  for (var i = 0; i < allTabs.length; i++) {
    allTabs[i].classList.remove("active");
  }

  // Show only the section the user clicked
  var targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
  }

   //Hightlights the correct tab button
  for (var i = 0; i < allTabs.length; i++) {
    if (allTabs[i].textContent.trim().toLowerCase().includes(sectionId.toLowerCase())) {
      allTabs[i].classList.add("active");
    }
  }
}

/* ============================================================
   EQUIPMENT PAGE: SECTION TABS (Football / Basketball / Tennis)
   Also shows one section at a time when a tab button is clicked.
   ============================================================ */

function showEquipmentSection(sectionId) {
  // Hide ALL equipment sections first
  var allSections = document.querySelectorAll(".equip-section");
  for (var i = 0; i < allSections.length; i++) {
    allSections[i].classList.remove("active");
  }

  // Remove the active style from ALL tab buttons
  var allTabs = document.querySelectorAll(".tab-btn");
  for (var i = 0; i < allTabs.length; i++) {
    allTabs[i].classList.remove("active");
  }

  // Show only the section the user clicked
  var targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  // Highlight the correct tab button
  for (var i = 0; i < allTabs.length; i++) {
    if (allTabs[i].textContent.trim().toLowerCase().includes(sectionId.toLowerCase())) {
      allTabs[i].classList.add("active");
    }
  }
}


/* ============================================================
   SECTION 6 – STAR RATING (Feedback Page)
   When a star is clicked, fills in all stars up to that number.
   ============================================================ */

// This variable remembers the rating the user chose
var selectedRating = 0;

function setRating(starNumber) {
  // Save the chosen rating
  selectedRating = starNumber;

  // Get all star labels
  var stars = document.querySelectorAll(".star-rating label");

  // Loop through each star and fill or empty it
  for (var i = 0; i < stars.length; i++) {
    var icon = stars[i].querySelector("i");

    // Stars are in reverse order in the HTML (5, 4, 3, 2, 1)
    // So star number = total stars - index
    var thisStar = stars.length - i;

    if (thisStar <= starNumber) {
      // Fill this star (solid)
      icon.className = "fas fa-star";
      stars[i].style.color = "#e87722"; // Orange colour
    } else {
      // Empty this star (outline)
      icon.className = "far fa-star";
      stars[i].style.color = "#555"; // Grey colour
    }
  }
}


/* ============================================================
            FEEDBACK FORM SUBMISSION
   ============================================================ */

function submitFeedback() {
  // Get each form field by its ID
  var firstName = document.getElementById("firstName");
  var surname   = document.getElementById("surname");
  var email     = document.getElementById("email");
  var subject   = document.getElementById("subject");
  var message   = document.getElementById("message");

  // Check that required fields are not empty
  if (!firstName || firstName.value.trim() === "") {
    alert("Please enter your first name.");
    firstName.focus(); 
    return;
  }

  if (!surname || surname.value.trim() === "") {
    alert("Please enter your surname.");
    surname.focus();
    return;
  }

  if (!email || email.value.trim() === "") {
    alert("Please enter your email address.");
    email.focus();
    return;
  }

  // Simple email format check – must contain @ and a dot
  if (!email.value.includes("@") || !email.value.includes(".")) {
    alert("Please enter a valid email address (e.g. name@email.com).");
    email.focus();
    return;
  }

  if (!subject || subject.value.trim() === "") {
    alert("Please enter a subject.");
    subject.focus();
    return;
  }

  if (!message || message.value.trim() === "") {
    alert("Please write your message.");
    message.focus();
    return;
  }

  // Check that the user gave a star rating
  if (selectedRating === 0) {
    alert("Please select a star rating before submitting.");
    return;
  }

  // If everything is filled in, show a success message
  alert(
    "Thank you, " + firstName.value.trim() + "!\n" +
    "Your feedback has been submitted.\n" +
    "Rating given: " + selectedRating + " star(s).\n\n" +
    "We will get back to you at " + email.value.trim() + " shortly."
  );

  // Clear the form after successful submission
  firstName.value = "";
  surname.value   = "";
  email.value     = "";
  subject.value   = "";
  message.value   = "";
  selectedRating  = 0;

  // Reset the star icons back to empty
  var stars = document.querySelectorAll(".star-rating label");
  for (var i = 0; i < stars.length; i++) {
    stars[i].querySelector("i").className = "far fa-star";
    stars[i].style.color = "#555";
  }
}

/* ============================================================
                NAVBAR SCROLL EFFECT
   Makes the navbar slightly darker when the user scrolls down,
   so it stands out more against the page content.
   ============================================================ */

window.addEventListener("scroll", function () {
  var navbar = document.querySelector(".navbar");

  if (navbar) {
    if (window.scrollY > 50) {
      
      navbar.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
      navbar.style.opacity   = "0.97";
       
    } else {
      navbar.style.boxShadow = "none";
      navbar.style.opacity   = "1";
    }
  }
});

/* ============================================================
                         PAGE LOAD
   Checks the URL hash (e.g. #men or #football) and
   automatically opens the right section on page load.
   ============================================================ */

window.addEventListener("DOMContentLoaded", function () {

  // Read the hash from the URL, e.g. "#men" becomes "men"
  var hash = window.location.hash.replace("#", "");

  // --- Clothing page sections ---
  var clothingSections = ["men", "women", "kids"];
  if (hash && clothingSections.includes(hash)) {
    showClothingSection(hash);
  }

  // --- Equipment page sections ---
  var equipmentSections = ["football", "basketball", "tennis"];
  if (hash && equipmentSections.includes(hash)) {
    showEquipmentSection(hash);
  }

  // --- Attach search button click event ---
  var searchBtn = document.querySelector(".search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", function () {
      runSearch();
    });
  }

  // --- Allow pressing Enter in the search box to search ---
  var searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (event) {
       
      // keyCode 13 is the Enter key
      if (event.key === "Enter" || event.keyCode === 13) {
        runSearch();
      }
    });
  }

  // --- Attach cart icon click to view cart ---
  var cartIcon = document.querySelector(".cart-icon");
  if (cartIcon) {
    cartIcon.addEventListener("click", function () {
      viewCart();
    });
  }

  // --- Attach feedback form submit button ---
  var submitBtn = document.querySelector(".btn-submit");
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      submitFeedback();
    });
  }

  // --- Attach star rating clicks ---
  var starLabels = document.querySelectorAll(".star-rating label");
   
  // Stars are stored in reverse (5 to 1), so index 0 = star 5
  for (var i = 0; i < starLabels.length; i++) {
     
    (function (label, starNum) {
      label.addEventListener("click", function () {
        setRating(starNum);
      });
    })(starLabels[i], starLabels.length - i);
  }

});




















