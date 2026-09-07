const MP_LINK = "https://link.mercadopago.com.ar/pirunet";
const ADMIN_WHATSAPP = "5493844546841";

const CART_KEY = "personalnet_cart";
const CUSTOMER_KEY = "personalnet_customer";
const ORDER_KEY = "personalnet_order";
const ORDER_WA_KEY = "personalnet_order_wa";

let cart = [];
let customer = {
  name: "",
  phone: ""
};


/* =========================
   ELEMENTOS
========================= */

const cartOverlay = document.getElementById("cartOverlay");
const afterOverlay = document.getElementById("afterOverlay");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const emptyCart = document.getElementById("emptyCart");
const cartBottom = document.getElementById("cartBottom");
const cartError = document.getElementById("cartError");

const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");

const sendWhatsApp = document.getElementById("sendWhatsApp");


/* =========================
   UTILIDADES
========================= */

function money(value) {
  return "$" + Number(value || 0).toLocaleString("es-AR");
}


function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}


/* =========================
   LOCAL STORAGE
========================= */

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}


function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));

    cart = Array.isArray(saved)
      ? saved.filter(item =>
          item &&
          typeof item.name === "string" &&
          Number.isFinite(Number(item.price)) &&
          Number.isFinite(Number(item.quantity))
        )
      : [];

    cart = cart.map(item => ({
      id: item.id || crypto.randomUUID?.() || String(Date.now() + Math.random()),
      name: item.name,
      price: Number(item.price),
      quantity: Math.max(1, Number(item.quantity))
    }));

  } catch {
    cart = [];
  }

  renderCart();
}


function saveCustomer() {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
}


function loadCustomer() {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOMER_KEY));

    if (saved && typeof saved === "object") {
      customer = {
        name: typeof saved.name === "string" ? saved.name : "",
        phone: typeof saved.phone === "string" ? saved.phone : ""
      };
    }
  } catch {
    customer = {
      name: "",
      phone: ""
    };
  }

  if (customerName) {
    customerName.value = customer.name;
  }

  if (customerPhone) {
    customerPhone.value = customer.phone;
  }
}


/* =========================
   CARRITO
========================= */

function addToCart(name, price) {

  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      name,
      price: Number(price),
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  openCart();
  showAddedMessage(name);
}


function changeQuantity(id, amount) {

  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  saveCart();
  renderCart();
}


function removeItem(id) {

  cart = cart.filter(item => item.id !== id);

  saveCart();
  renderCart();
}


function clearCart() {

  cart = [];

  saveCart();
  renderCart();

  if (cartError) {
    cartError.textContent = "";
  }
}


function renderCart() {

  if (!cartItems || !cartCount || !cartTotal) return;

  cartItems.innerHTML = "";

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalItems;
  cartTotal.textContent = money(totalPrice);

  const isEmpty = cart.length === 0;

  if (emptyCart) {
    emptyCart.style.display = isEmpty ? "block" : "none";
  }

  if (cartBottom) {
    cartBottom.style.display = isEmpty ? "none" : "block";
  }

  if (isEmpty) return;


  cart.forEach(item => {

    const element = document.createElement("div");

    element.className = "cart-item";

    element.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">
          ${escapeHTML(item.name)}
        </div>

        <div class="cart-item-price">
          ${money(item.price)} c/u
        </div>
      </div>

      <div class="cart-item-controls">

        <button
          class="qty-btn"
          type="button"
          data-action="decrease"
          data-id="${escapeHTML(item.id)}"
          aria-label="Disminuir cantidad">
          −
        </button>

        <span class="qty">
          ${item.quantity}
        </span>

        <button
          class="qty-btn"
          type="button"
          data-action="increase"
          data-id="${escapeHTML(item.id)}"
          aria-label="Aumentar cantidad">
          +
        </button>

        <button
          class="remove-btn"
          type="button"
          data-action="remove"
          data-id="${escapeHTML(item.id)}"
          aria-label="Eliminar producto">
          ×
        </button>

      </div>
    `;

    cartItems.appendChild(element);
  });
}


/* =========================
   MENSAJE DE PRODUCTO
========================= */

let toastTimer = null;


function showAddedMessage(name) {

  const oldToast = document.querySelector(".toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");

  toast.className = "toast";
  toast.textContent = `${name} Agregado Al Carrito ✓`;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 250);
  }, 2200);
}


/* =========================
   MODAL CARRITO
========================= */

function openCart() {

  if (!cartOverlay) return;

  cartOverlay.classList.add("active");
  cartOverlay.setAttribute("aria-hidden", "false");

  document.body.classList.add("locked");

  if (cartError) {
    cartError.textContent = "";
  }
}


function closeCart() {

  if (!cartOverlay) return;

  cartOverlay.classList.remove("active");
  cartOverlay.setAttribute("aria-hidden", "true");

  if (!afterOverlay?.classList.contains("active")) {
    document.body.classList.remove("locked");
  }
}


/* =========================
   TRIAL
========================= */

function requestTrial(service) {

  const message =
    `Hola PERSONALNET 👋\n\n` +
    `Quiero Solicitar Una Prueba De ${service}.\n\n` +
    `¿Me Pueden Indicar Cómo Continuar?`;

  const url =
    `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}


/* =========================
   CHECKOUT
========================= */

function checkout() {

  if (!cart.length) {
    showCartError("Tu Carrito Está Vacío.");
    return;
  }


  const name = customerName?.value.trim() || "";
  const phone = customerPhone?.value.trim() || "";


  if (name.length < 2) {
    showCartError("Ingresá Tu Nombre.");
    customerName?.focus();
    return;
  }


  if (normalizePhone(phone).length < 8) {
    showCartError("Ingresá Un Número De WhatsApp Válido.");
    customerPhone?.focus();
    return;
  }


  customer = {
    name,
    phone
  };

  saveCustomer();


  const message = createOrderMessage();

  const waUrl =
    `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;


  localStorage.setItem(
    ORDER_KEY,
    JSON.stringify({
      customer,
      items: cart,
      total: getCartTotal(),
      createdAt: new Date().toISOString()
    })
  );

  localStorage.setItem(
    ORDER_WA_KEY,
    waUrl
  );


  /*
    Primero Abrimos Mercado Pago.
    Después Mostramos El Paso Final
    Para Enviar El Comprobante.
  */

  window.open(
    MP_LINK,
    "_blank",
    "noopener,noreferrer"
  );


  closeCart();


  setTimeout(() => {
    showAfterPayment();
  }, 600);
}


function createOrderMessage() {

  const lines = cart.map(item => {

    const subtotal = item.price * item.quantity;

    return (
      `• ${item.name}\n` +
      `  Cantidad: ${item.quantity}\n` +
      `  Subtotal: ${money(subtotal)}`
    );

  });


  return (
    `Hola PERSONALNET 👋\n\n` +
    `Quiero Confirmar Mi Compra.\n\n` +

    `👤 Cliente: ${customer.name}\n` +
    `📱 WhatsApp: ${customer.phone}\n\n` +

    `🛒 Productos:\n` +
    `${lines.join("\n\n")}\n\n` +

    `💰 Total: ${money(getCartTotal())}\n\n` +

    `💳 Medio De Pago: Mercado Pago\n\n` +

    `Adjunto El Comprobante De Pago Para Verificar La Compra.`
  );
}


function getCartTotal() {

  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}


function showCartError(message) {

  if (!cartError) return;

  cartError.textContent = message;
}


/* =========================
   POST-PAGO
========================= */

function showAfterPayment() {

  if (!afterOverlay || !sendWhatsApp) return;

  const savedUrl =
    localStorage.getItem(ORDER_WA_KEY);

  if (savedUrl) {
    sendWhatsApp.href = savedUrl;
  } else {

    const message =
      `Hola PERSONALNET 👋\n\n` +
      `Acabo De Realizar Un Pago Y Quiero Enviar El Comprobante.`;

    sendWhatsApp.href =
      `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
  }


  afterOverlay.classList.add("active");
  afterOverlay.setAttribute("aria-hidden", "false");

  document.body.classList.add("locked");
}


function closeAfterPayment() {

  if (!afterOverlay) return;

  afterOverlay.classList.remove("active");
  afterOverlay.setAttribute("aria-hidden", "true");

  if (!cartOverlay?.classList.contains("active")) {
    document.body.classList.remove("locked");
  }
}


/* =========================
   EVENTOS
========================= */

document.getElementById("openCart")
  ?.addEventListener("click", openCart);


document.getElementById("closeCart")
  ?.addEventListener("click", closeCart);


document.getElementById("clearCart")
  ?.addEventListener("click", clearCart);


document.getElementById("checkoutButton")
  ?.addEventListener("click", checkout);


document.getElementById("closeAfter")
  ?.addEventListener("click", closeAfterPayment);


document.getElementById("closeAfterBottom")
  ?.addEventListener("click", closeAfterPayment);


/* BOTONES DEL CARRITO */

cartItems?.addEventListener("click", event => {

  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === "increase") {
    changeQuantity(id, 1);
  }

  if (action === "decrease") {
    changeQuantity(id, -1);
  }

  if (action === "remove") {
    removeItem(id);
  }
});


/* CERRAR HACIENDO CLICK AFUERA */

cartOverlay?.addEventListener("click", event => {

  if (event.target === cartOverlay) {
    closeCart();
  }

});


afterOverlay?.addEventListener("click", event => {

  if (event.target === afterOverlay) {
    closeAfterPayment();
  }

});


/* ESC */

document.addEventListener("keydown", event => {

  if (event.key !== "Escape") return;

  if (afterOverlay?.classList.contains("active")) {
    closeAfterPayment();
    return;
  }

  if (cartOverlay?.classList.contains("active")) {
    closeCart();
  }

});


/* GUARDAR DATOS DEL CLIENTE */

customerName?.addEventListener("input", () => {

  customer.name = customerName.value;

  saveCustomer();

});


customerPhone?.addEventListener("input", () => {

  customer.phone = customerPhone.value;

  saveCustomer();

});


/* CERRAR MENÚ AL NAVEGAR */

document.querySelectorAll(".nav-links a").forEach(link => {

  link.addEventListener("click", () => {
    closeCart();
  });

});


/* =========================
   INICIALIZACIÓN
========================= */

loadCart();
loadCustomer();
