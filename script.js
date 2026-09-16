/* =========================================
   SHOPCART - JAVASCRIPT
========================================= */


/* =========================================
   VARIABLES
========================================= */

let products = [];

let cart = [];

let discountRate = 0;

const TAX_RATE = 0.05;


/* =========================================
   GET ELEMENTS
========================================= */

const productGrid =
    document.getElementById("productGrid");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const subtotalElement =
    document.getElementById("subtotal");

const discountElement =
    document.getElementById("discount");

const taxElement =
    document.getElementById("tax");

const grandTotalElement =
    document.getElementById("grandTotal");


/* =========================================
   LOAD PRODUCTS FROM JSON
========================================= */

fetch("products.json")

    .then(response => {

        if (!response.ok) {
            throw new Error("products.json could not be loaded.");
        }

        return response.json();
    })

    .then(data => {

        products = data;

        displayProducts();

    })

    .catch(error => {

        console.error(error);

        productGrid.innerHTML = `
            <div style="
                grid-column: 1/-1;
                text-align:center;
                padding:40px;
                background:white;
                border-radius:12px;
            ">
                <h3>Unable to load products.</h3>
                <p>Please run this project using Live Server.</p>
            </div>
        `;
    });


/* =========================================
   DISPLAY PRODUCTS
========================================= */

function displayProducts() {

    productGrid.innerHTML = "";

    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

            <div class="product-image-box">

                <span class="product-category">
                    ${product.category}
                </span>

                <img
                    src="${product.image}"
                    alt="${product.title}"
                    onerror="this.src='https://via.placeholder.com/300x250?text=Product'">

            </div>


            <div class="product-details">

                <h3>${product.title}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-price">
                    ₹${product.price.toFixed(2)}
                </div>

                <button
                    class="add-btn"
                    onclick="addToCart(${product.id})">

                    Add to Cart

                </button>

            </div>
        `;

        productGrid.appendChild(card);
    });
}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(productId) {

    const product =
        products.find(item => item.id === productId);

    if (!product) {
        return;
    }


    const existingItem =
        cart.find(item => item.id === productId);


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    updateCart();


    /* Small feedback */

    const buttons =
        document.querySelectorAll(".add-btn");

    buttons.forEach(button => {

        if (
            button.getAttribute("onclick") ===
            `addToCart(${productId})`
        ) {

            const originalText =
                button.textContent;

            button.textContent = "✓ Added";

            button.classList.add("added");

            setTimeout(() => {

                button.textContent =
                    originalText;

                button.classList.remove("added");

            }, 700);
        }
    });
}


/* =========================================
   CHANGE QUANTITY
========================================= */

function changeQuantity(productId, change) {

    const item =
        cart.find(product => product.id === productId);

    if (!item) {
        return;
    }


    item.quantity += change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product => product.id !== productId
            );
    }


    updateCart();
}


/* =========================================
   REMOVE PRODUCT
========================================= */

function removeFromCart(productId) {

    cart =
        cart.filter(
            product => product.id !== productId
        );

    updateCart();
}


/* =========================================
   UPDATE CART UI
========================================= */

function updateCart() {

    cartItems.innerHTML = "";


    /* Empty Cart */

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div class="empty-icon">
                    🛒
                </div>

                <h3>Your cart is empty</h3>

                <p>
                    Add some products to your cart
                    to continue shopping.
                </p>

                <a href="#products">
                    Browse Products
                </a>

            </div>
        `;

    } else {

        cart.forEach(item => {

            const cartItem =
                document.createElement("div");

            cartItem.className = "cart-item";


            const itemTotal =
                item.price * item.quantity;


            cartItem.innerHTML = `

                <img
                    class="cart-item-image"
                    src="${item.image}"
                    alt="${item.title}">


                <div class="cart-item-info">

                    <h3>
                        ${item.title}
                    </h3>

                    <p class="cart-item-price">
                        ₹${item.price.toFixed(2)} each
                    </p>


                    <div class="quantity-box">

                        <button
                            onclick="changeQuantity(${item.id}, -1)">
                            −
                        </button>

                        <span class="quantity-number">
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(${item.id}, 1)">
                            +
                        </button>

                    </div>

                </div>


                <div class="cart-item-total">

                    ₹${itemTotal.toFixed(2)}

                </div>


                <button
                    class="remove-btn"
                    onclick="removeFromCart(${item.id})">

                    Remove

                </button>
            `;


            cartItems.appendChild(cartItem);
        });
    }


    updateSummary();
}


/* =========================================
   CALCULATE TOTALS
========================================= */

function updateSummary() {

    const subtotal =
        cart.reduce(
            (total, item) =>
                total + item.price * item.quantity,
            0
        );


    const discount =
        subtotal * discountRate;


    const amountAfterDiscount =
        subtotal - discount;


    const tax =
        amountAfterDiscount * TAX_RATE;


    const grandTotal =
        amountAfterDiscount + tax;


    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    /* Update UI */

    cartCount.textContent =
        totalQuantity;

    subtotalElement.textContent =
        `₹${subtotal.toFixed(2)}`;

    discountElement.textContent =
        `₹${discount.toFixed(2)}`;

    taxElement.textContent =
        `₹${tax.toFixed(2)}`;

    grandTotalElement.textContent =
        `₹${grandTotal.toFixed(2)}`;
}


/* =========================================
   PROMO CODE
========================================= */

document
    .getElementById("promoBtn")
    .addEventListener("click", applyPromo);


function applyPromo() {

    const input =
        document.getElementById("promoInput");

    const message =
        document.getElementById("promoMessage");


    const code =
        input.value
            .trim()
            .toUpperCase();


    if (code === "SAVE20") {

        if (cart.length === 0) {

            message.textContent =
                "Add products before applying the promo code.";

            message.style.color = "#dc2626";

            return;
        }


        discountRate = 0.20;


        message.textContent =
            "✓ SAVE20 applied - 20% discount!";

        message.style.color =
            "#16a34a";


        input.style.borderColor =
            "#16a34a";


        updateSummary();

    } else {

        discountRate = 0;


        message.textContent =
            "✕ Invalid promo code. Try SAVE20.";

        message.style.color =
            "#dc2626";


        input.style.borderColor =
            "#dc2626";


        updateSummary();
    }
}


/* =========================================
   CHECKOUT BUTTON
========================================= */

document
    .getElementById("checkoutBtn")
    .addEventListener("click", function () {

        if (cart.length === 0) {

            alert(
                "Your cart is empty. Please add a product first."
            );

            return;
        }


        document
            .getElementById("checkout")
            .scrollIntoView({
                behavior: "smooth"
            });
    });


/* =========================================
   VALIDATION HELPERS
========================================= */

function showError(inputId, errorId, message) {

    const input =
        document.getElementById(inputId);

    const error =
        document.getElementById(errorId);


    input.classList.add("invalid");

    input.classList.remove("valid");

    error.textContent = message;

    return false;
}


function showSuccess(inputId, errorId) {

    const input =
        document.getElementById(inputId);

    const error =
        document.getElementById(errorId);


    input.classList.remove("invalid");

    input.classList.add("valid");

    error.textContent = "";

    return true;
}


/* =========================================
   NAME VALIDATION
========================================= */

function validateName() {

    const value =
        document
            .getElementById("name")
            .value
            .trim();


    if (value.length < 3) {

        return showError(
            "name",
            "nameError",
            "Please enter at least 3 characters."
        );
    }


    return showSuccess(
        "name",
        "nameError"
    );
}


/* =========================================
   EMAIL VALIDATION
========================================= */

function validateEmail() {

    const value =
        document
            .getElementById("email")
            .value
            .trim();


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(value)) {

        return showError(
            "email",
            "emailError",
            "Please enter a valid email address."
        );
    }


    return showSuccess(
        "email",
        "emailError"
    );
}


/* =========================================
   ADDRESS VALIDATION
========================================= */

function validateAddress() {

    const value =
        document
            .getElementById("address")
            .value
            .trim();


    if (value.length < 5) {

        return showError(
            "address",
            "addressError",
            "Please enter a valid address."
        );
    }


    return showSuccess(
        "address",
        "addressError"
    );
}


/* =========================================
   CITY VALIDATION
========================================= */

function validateCity() {

    const value =
        document
            .getElementById("city")
            .value
            .trim();


    if (value.length < 2) {

        return showError(
            "city",
            "cityError",
            "Please enter a valid city."
        );
    }


    return showSuccess(
        "city",
        "cityError"
    );
}


/* =========================================
   PIN VALIDATION
========================================= */

function validatePin() {

    const value =
        document
            .getElementById("pin")
            .value
            .trim();


    if (!/^\d{6}$/.test(value)) {

        return showError(
            "pin",
            "pinError",
            "PIN code must contain 6 digits."
        );
    }


    return showSuccess(
        "pin",
        "pinError"
    );
}


/* =========================================
   CARD VALIDATION
========================================= */

function validateCard() {

    const value =
        document
            .getElementById("card")
            .value
            .replace(/\s/g, "");


    if (!/^\d{16}$/.test(value)) {

        return showError(
            "card",
            "cardError",
            "Card number must contain 16 digits."
        );
    }


    return showSuccess(
        "card",
        "cardError"
    );
}


/* =========================================
   EXPIRY VALIDATION
========================================= */

function validateExpiry() {

    const value =
        document
            .getElementById("expiry")
            .value
            .trim();


    const pattern =
        /^(0[1-9]|1[0-2])\/\d{2}$/;


    if (!pattern.test(value)) {

        return showError(
            "expiry",
            "expiryError",
            "Use MM/YY format."
        );
    }


    return showSuccess(
        "expiry",
        "expiryError"
    );
}


/* =========================================
   CVV VALIDATION
========================================= */

function validateCVV() {

    const value =
        document
            .getElementById("cvv")
            .value
            .trim();


    if (!/^\d{3}$/.test(value)) {

        return showError(
            "cvv",
            "cvvError",
            "CVV must contain 3 digits."
        );
    }


    return showSuccess(
        "cvv",
        "cvvError"
    );
}


/* =========================================
   STEP 1 → STEP 2
========================================= */

document
    .getElementById("next1")
    .addEventListener("click", function () {

        const nameValid =
            validateName();

        const emailValid =
            validateEmail();


        if (nameValid && emailValid) {

            goToStep(2);
        }
    });


/* =========================================
   STEP 2 → STEP 3
========================================= */

document
    .getElementById("next2")
    .addEventListener("click", function () {

        const addressValid =
            validateAddress();

        const cityValid =
            validateCity();

        const pinValid =
            validatePin();


        if (
            addressValid &&
            cityValid &&
            pinValid
        ) {

            goToStep(3);
        }
    });


/* =========================================
   STEP 2 BACK
========================================= */

document
    .getElementById("back2")
    .addEventListener("click", function () {

        goToStep(1);
    });


/* =========================================
   STEP 3 BACK
========================================= */

document
    .getElementById("back3")
    .addEventListener("click", function () {

        goToStep(2);
    });


/* =========================================
   CHANGE CHECKOUT STEP
========================================= */

function goToStep(stepNumber) {

    document
        .querySelectorAll(".checkout-step")
        .forEach(step => {

            step.classList.remove("active");
        });


    document
        .getElementById(`step${stepNumber}`)
        .classList.add("active");


    document
        .querySelectorAll(".progress-step")
        .forEach(step => {

            step.classList.remove("active");
        });


    document
        .getElementById(`indicator${stepNumber}`)
        .classList.add("active");
}


/* =========================================
   REAL-TIME VALIDATION
========================================= */

document
    .getElementById("name")
    .addEventListener("input", validateName);


document
    .getElementById("email")
    .addEventListener("input", validateEmail);


document
    .getElementById("address")
    .addEventListener("input", validateAddress);


document
    .getElementById("city")
    .addEventListener("input", validateCity);


document
    .getElementById("pin")
    .addEventListener("input", validatePin);


document
    .getElementById("card")
    .addEventListener("input", validateCard);


document
    .getElementById("expiry")
    .addEventListener("input", validateExpiry);


document
    .getElementById("cvv")
    .addEventListener("input", validateCVV);


/* =========================================
   CARD NUMBER ONLY DIGITS
========================================= */

document
    .getElementById("card")
    .addEventListener("input", function () {

        this.value =
            this.value.replace(/\D/g, "").slice(0, 16);
    });


/* =========================================
   PIN ONLY DIGITS
========================================= */

document
    .getElementById("pin")
    .addEventListener("input", function () {

        this.value =
            this.value.replace(/\D/g, "").slice(0, 6);
    });


/* =========================================
   CVV ONLY DIGITS
========================================= */

document
    .getElementById("cvv")
    .addEventListener("input", function () {

        this.value =
            this.value.replace(/\D/g, "").slice(0, 3);
    });


/* =========================================
   EXPIRY AUTO FORMAT
========================================= */

document
    .getElementById("expiry")
    .addEventListener("input", function () {

        let value =
            this.value.replace(/\D/g, "").slice(0, 4);


        if (value.length >= 3) {

            value =
                value.slice(0, 2) +
                "/" +
                value.slice(2);
        }


        this.value = value;
    });


/* =========================================
   PLACE ORDER
========================================= */

document
    .getElementById("checkoutForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        const cardValid =
            validateCard();

        const expiryValid =
            validateExpiry();

        const cvvValid =
            validateCVV();


        if (
            cardValid &&
            expiryValid &&
            cvvValid
        ) {

            const orderTotal =
                grandTotalElement.textContent;


            alert(
                "🎉 ORDER PLACED SUCCESSFULLY!\n\n" +
                "Thank you for shopping with ShopCart.\n\n" +
                "Order Total: " + orderTotal
            );


            /* Clear cart */

            cart = [];

            discountRate = 0;


            /* Clear promo */

            document
                .getElementById("promoInput")
                .value = "";

            document
                .getElementById("promoMessage")
                .textContent = "";


            /* Reset form */

            this.reset();


            /* Remove validation classes */

            document
                .querySelectorAll(".form-group input")
                .forEach(input => {

                    input.classList.remove("valid");
                    input.classList.remove("invalid");
                });


            document
                .querySelectorAll(".form-group small")
                .forEach(error => {

                    error.textContent = "";
                });


            /* Update cart */

            updateCart();


            /* Back to first checkout step */

            goToStep(1);


            /* Scroll to products */

            document
                .getElementById("products")
                .scrollIntoView({
                    behavior: "smooth"
                });
        }
    });


/* =========================================
   INITIAL CART
========================================= */

updateCart();