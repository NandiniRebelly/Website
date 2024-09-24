let cart = [];
let productsData = [];

// Fetch products categories from the Fake Store API
async function fetchCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await response.json();
        displayCategories(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}
function displayCategories(categories) {
    const categoryNav = document.getElementById('category-nav');
    categoryNav.innerHTML = ''; 

    const allCategory = document.createElement('li');
    allCategory.innerHTML = `<a class="nav-link" href="#" onclick="displayProductsByCategory('all')">All</a>`;
    categoryNav.appendChild(allCategory);

    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `<a class="nav-link" href="#" onclick="displayProductsByCategory('${category}')">${category}</a>`;
        categoryNav.appendChild(categoryItem);
    });
}

// Fetch products from the Fake Store API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        productsData = await response.json();
        displayProducts(productsData);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}
function displayProducts(products) {
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product', 'col-md-3');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}" style="width: 100%; height: auto;"/>
            <h5>${product.title}</h5>
            <p>$${product.price.toFixed(2)}</p>
            <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add to Cart</button>
        `;
        productContainer.appendChild(productElement);
    });
}
function addToCart(id, title, price) {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, title, price, quantity: 1 });
    }

    updateCartCount();
    displayCart();
}
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.innerText = cart.reduce((total, item) => total + item.quantity, 0);
}
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = ''; 

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('list-group-item', 'cart-item');
        cartItem.innerHTML = `
            ${item.title} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}
            <button class="btn btn-sm btn-danger float-right" onclick="removeFromCart(${item.id})">Remove</button>
            <button class="btn btn-sm btn-secondary float-right mr-2" onclick="increaseQuantity(${item.id})">+</button>
            <button class="btn btn-sm btn-secondary float-right mr-2" onclick="decreaseQuantity(${item.id})">-</button>
        `;
        cartItems.appendChild(cartItem);
    });
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="list-group-item">Your cart is empty.</div>';
    }
}
function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity++;
        updateCartCount();
        displayCart();
    }
}
function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartCount();
            displayCart();
        }
    }
}
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    displayCart();
}
function searchProducts() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredProducts = productsData.filter(product =>
        product.title.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}
function displayProductsByCategory(category) {
    let filteredProducts = [];

    if (category === 'all') {
        filteredProducts = productsData;
    } else {
        filteredProducts = productsData.filter(product => product.category === category);
    }

    displayProducts(filteredProducts);
}
fetchCategories();
fetchProducts();
