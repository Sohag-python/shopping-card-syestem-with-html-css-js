document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    updateCartUI();
});

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function loadProducts() {
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById("product-list");
            productList.innerHTML = "";
            products.forEach(product => {
                productList.innerHTML += `
                    <div class="product">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>$${product.price.toFixed(2)}</p>
                        <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                            Add to Cart
                        </button>
                    </div>`;
            });
        });
}

function addToCart(id, name, price) {
    let item = cart.find(p => p.id === id);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <p>${item.name} - $${item.price.toFixed(2)} x 
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                </p>
                <button onclick="removeFromCart(${index})">❌</button>
            </div>`;
    });

    cartTotal.innerText = `Total: $${total.toFixed(2)}`;
    cartCount.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateQuantity(index, quantity) {
    if (quantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = parseInt(quantity);
    }
    saveCart();
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
    } else {
        alert("Thank you for your purchase!");
        clearCart();
    }
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function toggleCart() {
    document.getElementById("cart").classList.toggle("active");
}
