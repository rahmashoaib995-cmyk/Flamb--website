// ===================================================
// Helper: تحديث عداد الكارت في الهيدر
// ===================================================
function updateCartCount() {
    let cartCountEl = document.querySelector("#cartCount");
    if (cartCountEl) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = totalItems;
    }
}


// ===================================================
//  (Login / Logout state في الهيدر)
// ===================================================
let scriptNav = document.querySelector("#scriptNav");
let isLoggedIn =
    localStorage.getItem("isLoggedIn") ||
    sessionStorage.getItem("isLoggedIn");

let loggedInUserName =
    localStorage.getItem("loggedInUserName") ||
    sessionStorage.getItem("loggedInUserName");

if (isLoggedIn === "true") {

    scriptNav.innerHTML = `
        <span class="px-3 py-1 text-sm font-sm">Hello, ${loggedInUserName}</span>

        <div class="relative">
            <button id="cartIconBtn" class="relative text-xl text-brand-brown cursor-pointer">
                <i class="fa-solid fa-cart-shopping"></i>
                <span id="cartCount" class="absolute -top-2 -right-2 bg-brand-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </button>

            <div id="cartDropdown" class="hidden fixed max-sm:left-2 max-sm:right-2 max-sm:top-20 sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-8 bg-white border border-brand-gold/30 rounded-md shadow-lg sm:w-72 max-w-[90vw] p-3 z-50">
                <div id="cartDropdownItems" class="flex flex-col gap-2 max-h-60 overflow-y-auto">
                    <!-- المنتجات هتتحط هنا من الـ JS -->
                </div>
                <a href="cart.html" class="block text-center bg-brand-beige hover:bg-brand-gold hover:text-white rounded py-2 mt-2 text-sm transition">
                    View All Products
                </a>
            </div>
        </div>

        <button id="logoutBtn" class="px-4 py-1.5 border border-brand-gold cursor-pointer rounded hover:bg-brand-gold hover:text-white transition text-sm">Logout</button>
    `;

    document.querySelector("#logoutBtn").addEventListener("click", function (e) {
        e.preventDefault();

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInUserName");
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("loggedInUserName");

        window.location.href = "index.html";
    });

    updateCartCount();
}


// ===================================================
// Search (موجودة بس في index.html)
// ===================================================
let searchInput = document.querySelector("#searchInput");
let searchBtn = document.querySelector("#searchBtn");
let searchType = document.querySelector("#searchType");
let products = document.querySelectorAll(".product");

if (searchBtn) {

    function filterProducts() {
        let searchValue = searchInput.value.trim().toLowerCase();
        let Type = searchType.value;

        products.forEach(function (product) {
            let productName = product.querySelector("h3").textContent.trim().toLowerCase();
            let productCategory = product.querySelector(".category").textContent.trim().toLowerCase();

            let isMatch = false;
            if (Type === "name") {
                isMatch = productName.includes(searchValue);
            }
            if (Type === "category") {
                isMatch = productCategory.includes(searchValue);
            }

            product.style.display = isMatch ? "block" : "none";
        });
    }

    searchBtn.addEventListener("click", function (e) {
        e.preventDefault();
        filterProducts();
    });

    searchInput.addEventListener("input", function () {
        filterProducts();
    });

    searchType.addEventListener("change", function () {
        filterProducts();
    });
}


// ===================================================
// Toast
// ===================================================
function showToast(message) {
    let toast = document.querySelector("#toast");
    if (!toast) return;

    toast.textContent = message;

    toast.classList.remove("opacity-0");
    toast.classList.add("opacity-100");

    setTimeout(function () {
        toast.classList.add("opacity-0");
        toast.classList.remove("opacity-100");
    }, 2000);
}

// ===================================================
// Wishlist (زرار القلب في كروت index.html)
// ===================================================
let wishlistBtns = document.querySelectorAll(".wishlist-btn");
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function updateHeartIcon(button, productId) {
    let icon = button.querySelector("i");
    let isInWishlist = wishlist.some(item => item.id === productId);

    if (isInWishlist) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        icon.classList.add("text-red-700");
    } else {
        icon.classList.add("fa-regular");
        icon.classList.remove("fa-solid");
        icon.classList.remove("text-red-700");
    }
}

wishlistBtns.forEach(function (button) {
    let productCard = button.closest(".product");
    let productId = productCard.dataset.id;
    updateHeartIcon(button, productId);
});

wishlistBtns.forEach(function (button) {
    button.addEventListener("click", function () {
        let productCard = button.closest(".product");

        let productId = productCard.dataset.id;
        let productName = productCard.dataset.name;
        let productPrice = productCard.dataset.price;
        let productImage = productCard.dataset.image;
        let productCategory = productCard.querySelector(".category").textContent.replace("Category:", "").trim();

        let existingIndex = wishlist.findIndex(item => item.id === productId);

        if (existingIndex === -1) {
            wishlist.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                category: productCategory
            });
            showToast("❤️ Added to Wishlist");
        } else {
            wishlist.splice(existingIndex, 1);
            showToast("💔 Removed from Wishlist");
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        updateHeartIcon(button, productId);
    });
});


// ===================================================
// Add to Cart (زرار Add to Cart في كروت index.html)
// ===================================================
let addCartBtns = document.querySelectorAll(".add-cart-btn");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartButton(button, productId) {
    let isInCart = cart.some(item => item.id === productId);

    if (isInCart) {
        button.textContent = "Remove from Cart";
        button.classList.remove("bg-[#4A3324]", "hover:bg-brand-brown");
        button.classList.add("bg-brand-gold", "hover:bg-brand-brown");
    } else {
        button.textContent = "Add to Cart";
        button.classList.remove("bg-brand-gold", "hover:bg-brand-brown");
        button.classList.add("bg-[#4A3324]", "hover:bg-brand-brown");
    }
}

// أول ما الصفحة تفتح، اظبطي شكل كل زرار حسب الكارت المحفوظ
addCartBtns.forEach(function (button) {
    let productCard = button.closest(".product");
    let productId = productCard.dataset.id;
    updateCartButton(button, productId);
});

addCartBtns.forEach(function (button) {
    button.addEventListener("click", function () {
        let productCard = button.closest(".product");

        let productId = productCard.dataset.id;
        let productName = productCard.dataset.name;
        let productPrice = productCard.dataset.price;
        let productImage = productCard.dataset.image;
        let productCategory = productCard.querySelector(".category").textContent.replace("Category:", "").trim();

        let existingIndex = cart.findIndex(item => item.id === productId);

        if (existingIndex === -1) {
            // مش موجود، ضيفيه
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                category: productCategory,
                quantity: 1
            });
            showToast("🛒 Product added to cart");
        } else {
            // موجود بالفعل، امسحيه بالكامل
            cart.splice(existingIndex, 1);
            showToast("🗑 Product removed from cart");
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartButton(button, productId);
        updateCartCount();

        // لو الـ Dropdown مفتوح، حدّثيه فورًا
        let dropdownItems = document.querySelector("#cartDropdownItems");
        if (dropdownItems) {
            renderCartDropdown();
        }
    });
});


// ===================================================
// عرض الكارت في cart.html
// ===================================================
let cartContainer = document.querySelector("#cartContainer");

if (cartContainer) {
    renderCart();
}

function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartContainer = document.querySelector("#cartContainer");
    let emptyCartMsg = document.querySelector("#emptyCartMsg");

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        emptyCartMsg.classList.remove("hidden");
        updateTotalPrice();
        return;
    } else {
        emptyCartMsg.classList.add("hidden");
    }

    cart.forEach(function (item) {

        let itemHTML = `
<div class="cart-item w-full flex gap-4 bg-white border border-brand-gold/30 rounded-md shadow-md p-4 transform transition-all duration-300 hover:border-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-900 hover:border-brand-gold" data-id="${item.id}">
    
    
    <div class="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
    </div>
    
   
    <div class="flex-1 flex flex-col justify-between">
        
       
        <div>
            <h3 class="font-bold  text-sm md:text-base leading-tight">${item.name}</h3>
            <p class="text-xs mt-1">Category: <span class="category">${item.category}</span></p>
            <p class="text-sm font-semibold text-brand-gold mt-1">Price: $${item.price}</p>
        </div>
        
        
        <div class="flex items-center gap-3 mt-3 flex-wrap">
            
            <div class="flex items-center border border-gray-300 rounded-md overflow-hidden bg-gray-50">
                <button class="decrease-btn px-2 py-1 hover:bg-gray-200 text-xs font-bold transition-colors">-</button>
                <span class="quantity-num px-3 text-xs font-semibold">${item.quantity}</span>
                <button class="increase-btn px-2 py-1 hover:bg-gray-200 text-xs font-bold transition-colors">+</button>
            </div>
            
           
            <button class="remove-btn bg-brand-gold hover:bg-brand-brown text-white text-xs px-3 py-1.5 rounded transition-all cursor-pointer">
                Remove from Cart
            </button>
            
        </div>
    </div>
</div>
`;


        cartContainer.insertAdjacentHTML("beforeend", itemHTML);
    });

    attachCartEvents();
    updateTotalPrice();
}

function attachCartEvents() {
    document.querySelectorAll(".increase-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            let itemEl = btn.closest(".cart-item");
            let id = itemEl.dataset.id;
            changeQuantity(id, 1);
        });
    });

    document.querySelectorAll(".decrease-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            let itemEl = btn.closest(".cart-item");
            let id = itemEl.dataset.id;
            changeQuantity(id, -1);
        });
    });

    document.querySelectorAll(".remove-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            let itemEl = btn.closest(".cart-item");
            let id = itemEl.dataset.id;
            removeFromCart(id);
        });
    });
}

function changeQuantity(id, amount) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(item => item.id === id);

    if (item) {
        item.quantity += amount;

        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    updateCartCount();
    showToast("🗑 Product removed");
}

function updateTotalPrice() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalPriceEl = document.querySelector("#totalPrice");

    let total = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    if (totalPriceEl) {
        totalPriceEl.textContent = `Total Price: $${total.toFixed(2)}`;
    }
}


// ===================================================
// ✅ الجزء الجديد المُضاف: Cart Dropdown في الهيدر
// ===================================================
function renderCartDropdown() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let dropdownItems = document.querySelector("#cartDropdownItems");

    if (!dropdownItems) return;

    dropdownItems.innerHTML = "";

    if (cart.length === 0) {
        dropdownItems.innerHTML = `<p class="text-sm text-gray-500 text-center py-3">Cart is empty</p>`;
        return;
    }

    cart.forEach(function (item) {
       let itemHTML = `
    <div class="flex items-center justify-between gap-2 flex-wrap border-b border-brand-gold/30 pb-2" data-id="${item.id}">
        <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold truncate">${item.name}</p>
            <p class="text-xs text-brand-gold">Price: $${item.price}</p>
        </div>
        <div class="flex items-center gap-1.5 text-xs shrink-0">
            <button class="dropdown-decrease border w-6 h-6 rounded cursor-pointer shrink-0" data-id="${item.id}">-</button>
            <span class="w-4 text-center">${item.quantity}</span>
            <button class="dropdown-increase border w-6 h-6 rounded cursor-pointer shrink-0" data-id="${item.id}">+</button>
            <button class="dropdown-remove text-brand-brown hover:text-red-700 ml-1 cursor-pointer shrink-0" data-id="${item.id}">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </div>
`;
        dropdownItems.insertAdjacentHTML("beforeend", itemHTML);
    });

    document.querySelectorAll(".dropdown-increase").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            changeQuantityFromDropdown(btn.dataset.id, 1);
        });
    });

    document.querySelectorAll(".dropdown-decrease").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            changeQuantityFromDropdown(btn.dataset.id, -1);
        });
    });

    document.querySelectorAll(".dropdown-remove").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            removeFromCartCompletely(btn.dataset.id);
        });
    });
}

function changeQuantityFromDropdown(id, amount) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(item => item.id === id);

    if (item) {
        item.quantity += amount;

        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
        }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    syncEverything(id);
}

function removeFromCartCompletely(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== id);

    localStorage.setItem("cart", JSON.stringify(cart));
    showToast("🗑 Product removed from cart");
    syncEverything(id);
}

// دالة موحّدة بتحدّث كل حاجة مرتبطة بالكارت في وقت واحد
function syncEverything(productId) {
    updateCartCount();
    renderCartDropdown();

    // لو المنتج ده موجود ككارت في index.html، حدّثي شكل الزرار بتاعه
    let button = document.querySelector(`.product[data-id="${productId}"] .add-cart-btn`);
    if (button) {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
        updateCartButton(button, productId);
    }

    // لو إحنا في cart.html، حدّثي الصفحة كلها
    if (document.querySelector("#cartContainer")) {
        renderCart();
    }
}

let cartIconBtn = document.querySelector("#cartIconBtn");
let cartDropdown = document.querySelector("#cartDropdown");

if (cartIconBtn) {
    cartIconBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        cartDropdown.classList.toggle("hidden");
        renderCartDropdown();
    });

    // أي ضغطة جوه الـ Dropdown نفسه متسربش لحدث الإغلاق العام
    cartDropdown.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    document.addEventListener("click", function (e) {
        if (!cartDropdown.contains(e.target) && !cartIconBtn.contains(e.target)) {
            cartDropdown.classList.add("hidden");
        }
    });
}


// ===================================================
// عرض الـ Favorite Items في cart.html
// ===================================================
let wishlistContainer = document.querySelector("#wishlistContainer");

if (wishlistContainer) {
    renderWishlistPage();
}

function renderWishlistPage() {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let wishlistContainer = document.querySelector("#wishlistContainer");
    let emptyWishlistMsg = document.querySelector("#emptyWishlistMsg");

    wishlistContainer.innerHTML = "";

    if (wishlist.length === 0) {
        emptyWishlistMsg.classList.remove("hidden");
        return;
    } else {
        emptyWishlistMsg.classList.add("hidden");
    }

    wishlist.forEach(function (item) {
       let itemHTML = `
    <div class="wishlist-item bg-white border border-brand-gold/30 rounded-md shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg  hover:shadow-yellow-900 hover:border-brand-gold hover:borde-2" data-id="${item.id}">
    
        <div class="w-full h-48 overflow-hidden bg-gray-100">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
        </div>
        
       
        <div class="p-3 text-center flex flex-col justify-between items-center">
            <h3 class="font-bold text-sm md:text-base line-clamp-1">${item.name}</h3>
            <p class="text-xs  mt-0.5">Category: ${item.category}</p>
            
            
            <button class="remove-wishlist-btn mt-2 text-base cursor-pointer hover:scale-125 transition-transform text-red-500">
                <i class="fa-solid fa-heart"></i>
            </button>
        </div>
    </div>
`;

        wishlistContainer.insertAdjacentHTML("beforeend", itemHTML);
    });

    document.querySelectorAll(".remove-wishlist-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            let itemEl = btn.closest(".wishlist-item");
            let id = itemEl.dataset.id;

            let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            wishlist = wishlist.filter(item => item.id !== id);

            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            renderWishlistPage();
            showToast("💔 Removed from Wishlist");
        });
    });
}

