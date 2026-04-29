/* ============================================================
   ProSport Gear – main.js
   This file handles ALL interactive features across the site:
     1. Search bar
     2. Shopping cart
     3. Buy Now / Add to Cart buttons
     4. Clothing & Equipment section tabs
     5. Star rating (feedback page)
     6. Feedback form submission
     7. Navbar scroll effect
   ============================================================ */


/* ============================================================
   SECTION 1 – SEARCH BAR
   Reads what the user typed and shows a simple alert.
   You can later replace the alert with real search results.
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


/* ============================================================
   SECTION 2 – SHOPPING CART
   A simple cart stored as an array of items.
   Items are added when the user clicks "Add to Cart".
   The cart icon shows how many items are inside.
   ============================================================ */

// This array holds all items added to the cart
var cart = [];

// This function adds a product to the cart
function addToCart(productName, productPrice) {
  // Create a simple product object
  var product = {
    name: productName,
    price: productPrice
  };

  // Add the product to the cart array
  cart.push(product);

  // Update the cart counter badge on the icon
  updateCartBadge();

  // Tell the user the item was added
  alert(productName + " has been added to your cart!");
}

// This function updates the little number badge on the cart icon
function updateCartBadge() {
  // Find the cart icon element
  var cartIcon = document.querySelector(".cart-icon");

  if (cartIcon) {
    // Show the number of items next to the cart icon
    cartIcon.setAttribute("title", cart.length + " item(s) in cart");

    // If a badge element exists, update it; otherwise create one
    var badge = document.getElementById("cart-badge");

    if (!badge) {
      // Create a new badge element
      badge = document.createElement("span");
      badge.id = "cart-badge";
      badge.style.cssText =
        "background: red; color: white; border-radius: 50%;" +
        "padding: 2px 6px; font-size: 0.7rem; position: relative;" +
        "top: -10px; left: -8px; font-weight: bold;";
      cartIcon.parentNode.appendChild(badge);
    }

    // Set the number shown on the badge
    badge.textContent = cart.length;
  }
}

// This function shows all items currently in the cart
function viewCart() {
  // If the cart is empty
  if (cart.length === 0) {
    alert("Your cart is empty. Start shopping!");
    return;
  }

  // Build a message listing all cart items
  var cartMessage = "Your Cart:\n";
  var total = 0;

  for (var i = 0; i < cart.length; i++) {
    cartMessage += (i + 1) + ". " + cart[i].name + " – P" + cart[i].price + "\n";
    total += cart[i].price;
  }

  cartMessage += "\nTotal: P" + total.toFixed(2);
  alert(cartMessage);
}


/* ============================================================
   SECTION 3 – BUY NOW BUTTONS
   When the user clicks "Buy Now" on a product, this function
   confirms their intention and pretends to process the purchase.
   ============================================================ */

function buyNow(productName, productPrice) {
  // Ask the user to confirm the purchase
  var confirmed = confirm(
    "You are about to buy:\n" +
    productName + " for P" + productPrice + "\n\n" +
    "Proceed to checkout?"
  );

  // If they clicked OK
  if (confirmed) {
    alert("Thank you! Your order for " + productName + " has been placed.");
  } else {
    // If they clicked Cancel, do nothing
    alert("Purchase cancelled. You can continue shopping.");
  }
}


/* ============================================================
   SECTION 4 – CLOTHING PAGE: SECTION TABS (Men / Women / Kids)
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

  // Highlight the correct tab button
  // The button whose text matches the sectionId gets highlighted
  for (var i = 0; i < allTabs.length; i++) {
    if (allTabs[i].textContent.trim().toLowerCase().includes(sectionId.toLowerCase())) {
      allTabs[i].classList.add("active");
    }
  }
}


/* ============================================================
   SECTION 5 – EQUIPMENT PAGE: SECTION TABS (Football / Basketball / Tennis)
   Same logic as clothing tabs but for equipment sections.
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
   SECTION 7 – FEEDBACK FORM SUBMISSION
   Reads all form fields, checks they are filled in,
   then shows a success message.
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
    firstName.focus(); // Move cursor to that field
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

  // Reset the star icons back to empty/grey
  var stars = document.querySelectorAll(".star-rating label");
  for (var i = 0; i < stars.length; i++) {
    stars[i].querySelector("i").className = "far fa-star";
    stars[i].style.color = "#555";
  }
}


/* ============================================================
   SECTION 8 – NAVBAR SCROLL EFFECT
   Makes the navbar slightly darker when the user scrolls down,
   so it stands out more against the page content.
   ============================================================ */

window.addEventListener("scroll", function () {
  var navbar = document.querySelector(".navbar");

  if (navbar) {
    if (window.scrollY > 50) {
      // User has scrolled down – darken the navbar
      navbar.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.4)";
      navbar.style.opacity   = "0.97";
    } else {
      // User is at the top – restore original style
      navbar.style.boxShadow = "none";
      navbar.style.opacity   = "1";
    }
  }
});


/* ============================================================
   SECTION 9 – PAGE LOAD: AUTO-DETECT WHICH PAGE IS OPEN
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
    // Use a closure to capture the correct star number
    (function (label, starNum) {
      label.addEventListener("click", function () {
        setRating(starNum);
      });
    })(starLabels[i], starLabels.length - i);
  }

});
/* ============================================================
   END OF main.js
   To link this file to every HTML page, add this line just
   before the closing </body> tag on each page:

   <script src="main.js"></script>

   Make sure Bootstrap's script tag comes BEFORE this line.
   ============================================================ */
