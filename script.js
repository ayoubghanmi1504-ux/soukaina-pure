// ==========================================
// SOUKAINA PURE - MAIN SCRIPT
// ==========================================

const PHONE_NUMBER = "212710270328"; 
let monedaActual = "DH"; // 'DH' o '€'
let cart = JSON.parse(localStorage.getItem('soukaina_cart')) || [];

// Control de paginación
let selectedCategory = 'all';
let currentVisibleCount = 8;
const ITEMS_PER_PAGE = 8;

// ------------------------------------------
// 1. SISTEMA DE MONEDA Y GEOLOCALIZACIÓN (10 DH = 1 €)
// ------------------------------------------
function detectarUbicacionYMoneda() {
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            if (data.country_code === 'MA') {
                monedaActual = 'DH';
            } else {
                monedaActual = '€';
            }
            const selector = document.getElementById('monedaSelect');
            if (selector) selector.value = monedaActual;
            renderCatalog();
            updateCartUI();
        })
        .catch(() => {
            renderCatalog();
            updateCartUI();
        });
}

function obtenerPrecioTexto(precioEnDH) {
    if (monedaActual === '€') {
        const precioEuro = Math.round(precioEnDH / 10);
        return `${precioEuro} €`;
    }
    return `${precioEnDH} DH`;
}

function obtenerPrecioNumerico(precioEnDH) {
    return monedaActual === '€' ? Math.round(precioEnDH / 10) : precioEnDH;
}

function cambiarMoneda(nuevaMoneda) {
    monedaActual = nuevaMoneda;
    renderCatalog();
    updateCartUI();
}

// ------------------------------------------
// 2. BUSCADOR, PESTAÑAS Y PAGINACIÓN (LOAD MORE)
// ------------------------------------------
function filterCategoryTab(category) {
    selectedCategory = category;
    currentVisibleCount = ITEMS_PER_PAGE;

    document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.getAttribute('data-cat') === category) {
            btn.classList.add('bg-[#D32F2F]', 'text-white');
            btn.classList.remove('bg-gray-100', 'text-gray-700');
        } else {
            btn.classList.remove('bg-[#D32F2F]', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        }
    });

    renderCatalog();
}

function selectCategory(category) {
    filterCategoryTab(category);
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function filterProducts() {
    currentVisibleCount = ITEMS_PER_PAGE;
    renderCatalog();
}

function loadMoreProducts() {
    currentVisibleCount += ITEMS_PER_PAGE;
    renderCatalog();
}

// ------------------------------------------
// 3. DIBUJAR CATÁLOGO DE PRODUCTOS
// ------------------------------------------
function renderCatalog() {
    const container = document.getElementById('catalog-container');
    const searchElem = document.getElementById('search-input');
    const catElem = document.getElementById('category-select');
    const loadMoreContainer = document.getElementById('load-more-container');

    if (!container || typeof productos === 'undefined') return;

    const query = searchElem ? searchElem.value.toLowerCase().trim() : '';
    const categorySelectVal = catElem ? catElem.value : 'all';
    const activeCategory = selectedCategory !== 'all' ? selectedCategory : categorySelectVal;

    // Filtrar productos
    const filtered = productos.filter(p => {
        const matchesQuery = p.name.toLowerCase().includes(query) || (p.descShort && p.descShort.toLowerCase().includes(query));
        const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
        return matchesQuery && matchesCategory;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-400">
                <p class="text-xl font-bold">No se encontraron productos</p>
                <p class="text-sm">Prueba buscando con otra palabra o categoría.</p>
            </div>`;
        if (loadMoreContainer) loadMoreContainer.classList.add('hidden');
        return;
    }

    // Paginación (slice)
    const visibleItems = filtered.slice(0, currentVisibleCount);

    container.innerHTML = visibleItems.map(p => `
        <div class="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col justify-between">
            <div>
                <!-- Clic en la foto para abrir modal -->
                <div onclick="openProductModal(${p.id})" class="bg-gray-50 h-56 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden cursor-pointer">
                    ${p.tag ? `<span class="absolute top-3 right-3 bg-[#D32F2F] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase z-10 shadow-md tracking-wider">${p.tag}</span>` : ''}
                    <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://via.placeholder.com/300?text=Soukaina+Pure'">
                </div>
                
                <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">${p.category || 'General'}</span>
                <h3 onclick="openProductModal(${p.id})" class="font-bold text-lg mb-1 group-hover:text-[#D32F2F] transition-colors cursor-pointer line-clamp-1">${p.name}</h3>
                <p class="text-gray-500 text-sm mb-3 line-clamp-2">${p.descShort}</p>
            </div>
            
            <div>
                <p class="text-[#D32F2F] font-black text-xl mb-3">${obtenerPrecioTexto(p.price)}</p>
                <div class="grid grid-cols-5 gap-2">
                    <button onclick="openProductModal(${p.id})" class="col-span-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold py-2.5 rounded-xl text-xs">
                        Detalles 👁️
                    </button>
                    <button onclick="addToCart(${p.id})" class="col-span-3 bg-[#D32F2F] text-white font-bold py-2.5 rounded-xl hover:bg-[#222222] transition-all text-xs flex items-center justify-center gap-1">
                        Añadir 🛒
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Mostrar / Ocultar botón "Cargar más"
    if (loadMoreContainer) {
        if (filtered.length > currentVisibleCount) {
            loadMoreContainer.classList.remove('hidden');
        } else {
            loadMoreContainer.classList.add('hidden');
        }
    }
}

// ------------------------------------------
// 4. VENTANA FLOTANTE DE DETALLES (MODAL)
// ------------------------------------------
function openProductModal(productId) {
    if (typeof productos === 'undefined') return;
    const p = productos.find(item => item.id === productId);
    if (!p) return;

    const img = document.getElementById('modal-img');
    const title = document.getElementById('modal-title');
    const price = document.getElementById('modal-price');
    const category = document.getElementById('modal-category');
    const desc = document.getElementById('modal-desc');
    const ingredients = document.getElementById('modal-ingredients');
    const addBtn = document.getElementById('modal-add-btn');

    if (img) img.src = p.image;
    if (title) title.innerText = p.name;
    if (price) price.innerText = obtenerPrecioTexto(p.price);
    if (category) category.innerText = p.category || 'General';
    if (desc) desc.innerText = p.descFull || p.descShort;
    if (ingredients) ingredients.innerText = p.ingredients || "Ingredientes 100% naturales certificados.";
    
    if (addBtn) {
        addBtn.onclick = function() {
            addToCart(p.id);
            closeProductModal();
        };
    }

    const overlay = document.getElementById('product-modal-overlay');
    const modal = document.getElementById('product-modal');

    if (overlay) overlay.classList.remove('hidden');
    if (modal) modal.classList.remove('hidden');
}

function closeProductModal() {
    const overlay = document.getElementById('product-modal-overlay');
    const modal = document.getElementById('product-modal');
    if (overlay) overlay.classList.add('hidden');
    if (modal) modal.classList.add('hidden');
}

// ------------------------------------------
// 5. LÓGICA DEL CARRITO DE COMPRAS
// ------------------------------------------
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (!drawer || !overlay) return;

    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';

    if (drawer.classList.contains('translate-x-full') || drawer.classList.contains('-translate-x-full')) {
        drawer.classList.remove('translate-x-full', '-translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        if (isRtl) {
            drawer.classList.add('-translate-x-full');
        } else {
            drawer.classList.add('translate-x-full');
        }
        overlay.classList.add('hidden');
    }
}

function addToCart(productId) {
    const product = productos.find(p => p.id === productId);
    if (!product) return;

    const item = cart.find(p => p.id === productId);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    
    // Registrar evento de añadido al carrito en GA4
    if (typeof gtag === 'function') {
        gtag('event', 'add_to_cart', {
            'event_category': 'Ecommerce',
            'event_label': product.name,
            'value': obtenerPrecioNumerico(product.price),
            'currency': monedaActual === '€' ? 'EUR' : 'MAD'
        });
    }

    const drawer = document.getElementById('cart-drawer');
    if (drawer && (drawer.classList.contains('translate-x-full') || drawer.classList.contains('-translate-x-full'))) {
        toggleCart();
    }
}

function changeQuantity(id, delta) {
    const item = cart.find(p => p.id === id);
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(p => p.id !== id);
    
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('soukaina_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += obtenerPrecioNumerico(item.price) * item.quantity;
    });

    const badge = document.getElementById('cart-count-badge');
    if (badge) badge.innerText = totalCount;
    
    const priceElem = document.getElementById('cart-total-price');
    if (priceElem) priceElem.innerText = `${totalPrice} ${monedaActual}`;

    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<div class="text-center py-10 text-gray-400 font-medium">El carrito está vacío</div>`;
        return;
    }

    container.innerHTML = cart.map(item => {
        const itemPriceCalculated = obtenerPrecioNumerico(item.price);
        const itemSubtotal = itemPriceCalculated * item.quantity;

        return `
            <div class="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div class="flex items-center gap-3">
                    <img src="${item.image}" class="w-12 h-12 rounded-lg object-cover" onerror="this.src='https://via.placeholder.com/100'">
                    <div>
                        <h4 class="font-bold text-sm text-gray-800 line-clamp-1">${item.name}</h4>
                        <p class="text-xs text-[#D32F2F] font-bold">${itemSubtotal} ${monedaActual}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-gray-200">
                    <button onclick="changeQuantity(${item.id}, -1)" class="text-gray-500 font-bold px-1.5 hover:text-[#D32F2F]">-</button>
                    <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" class="text-gray-500 font-bold px-1.5 hover:text-[#D32F2F]">+</button>
                </div>
            </div>
        `;
    }).join('');
}

// ------------------------------------------
// 6. ENVIAR PEDIDO A WHATSAPP
// ------------------------------------------
function sendOrderToWhatsApp() {
    if (cart.length === 0) return alert("Añade productos al carrito primero.");

    const nameElem = document.getElementById('client-name');
    const cityElem = document.getElementById('client-city');

    const name = nameElem ? nameElem.value.trim() : '';
    const city = cityElem ? cityElem.value.trim() : '';

    let message = "🌿 *NUEVO PEDIDO - SOUKAINA PURE* 🌿\n\n";
    if (name) message += `👤 *Cliente:* ${name}\n`;
    if (city) message += `📍 *Ciudad:* ${city}\n`;
    message += `----------------------------------------\n`;

    let total = 0;
    cart.forEach(item => {
        const priceCalc = obtenerPrecioNumerico(item.price);
        const subtotal = priceCalc * item.quantity;
        total += subtotal;
        message += `• *${item.name}* x${item.quantity} -> ${subtotal} ${monedaActual}\n`;
    });

    message += `----------------------------------------\n`;
    message += `💰 *TOTAL ESTIMADO:* ${total} ${monedaActual}\n\n`;
    message += `Por favor, confirmen mi pedido. ¡Muchas gracias!`;

    // Medición en Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'click_whatsapp_checkout', {
            'event_category': 'Ventas',
            'value': total,
            'currency': monedaActual === '€' ? 'EUR' : 'MAD'
        });
    }

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}

// ------------------------------------------
// 7. CONTADOR DE VISITAS Y ARRANQUE
// ------------------------------------------
function initVisitCounter() {
    try {
        let visits = parseInt(localStorage.getItem('soukaina_visits') || '0') + 1;
        localStorage.setItem('soukaina_visits', visits);
        const counter = document.getElementById('visit-counter');
        if (counter) counter.innerText = visits;
    } catch(e) {}
}

function initApp() {
    detectarUbicacionYMoneda();
    initVisitCounter();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}