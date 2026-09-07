const MP_LINK = "https://link.mercadopago.com.ar/pirunet";
const ADMIN_WHATSAPP = "5493844546841";

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
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function normalizePhone(phone) {
  return String(phone || "")
    .replace(/\D/g, "")
    .trim();
}


/* =========================
   LOCAL STORAGE
========================= */

function saveCart() {
  try {
    localStorage.setItem("personalnet_cart", JSON.stringify(cart));
  } catch (error) {
    console.warn("No se pudo guardar el carrito.", error);
  }
}


function loadCart() {
  try {
    const saved = localStorage.getItem("personalnet_cart");

    if (!saved) {
      cart = [];
      renderCart();
      return;
    }

    const parsed = JSON.parse(saved);

    cart = Array.isArray(parsed) ? parsed : [];

  } catch (error) {
    cart = [];
  }

  renderCart();
}


function loadCustomer() {
  try {
    const saved = localStorage.getItem("personalnet_customer");

    if (!saved) return;

    const parsed = JSON.parse(saved);

    if (!parsed || typeof parsed !== "object") return;

    customer = {
      name: parsed.name || "",
      phone: parsed.phone || ""
    };

    if (customerName) {
      customerName.value = customer.name;
    }

    if (customerPhone) {
      customerPhone.value = customer.phone;
    }

  } catch (error) {
    console.warn("No se pudieron cargar los datos del cliente.");
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
      id: Date.now() + Math.random(),
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

  const item = cart.find(product => String(product.id) === String(id));

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => String(product.id) !== String(id));
  }

  saveCart();
  renderCart();
}


function removeItem(id) {

  cart = cart.filter(
    item => String(item.id) !== String(id)
  );

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

  let total = 0;
  let count = 0;

  cart.forEach(item => {

    const quantity = Math.max(1, Number(item.quantity) || 1);
    const price = Number(item.price) || 0;

    total += price * quantity;
    count += quantity;

    const element = document.createElement("div");

    element.className = "cart-item";

    element.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">
          ${escapeHTML(item.name)}
        </div>

        <div class="cart-item-price">
          ${money(price)} c/u
        </div>
      </div>

      <div class="cart-item-controls">

        <button
          class="qty-btn"
          type="button"
          onclick="changeQuantity('${String(item.id)}', -1)"
          aria-label="Disminuir cantidad">
          −
        </button>

        <span class="qty">${quantity}</span>

        <button
          class="qty-btn"
          type="button"
          onclick="changeQuantity('${String(item.id)}', 1)"
          aria-label="Aumentar cantidad">
          +
        </button>

        <button
          class="remove-btn"
          type="button"
          onclick="removeItem('${String(item.id)}')"
          aria-label="Eliminar producto">
          ×
        </button>

      </div>
    `;

    cartItems.appendChild(element);
  });


  cartCount.textContent = count;
  cartTotal.textContent = money(total);


  if (cart.length === 0) {

    if (emptyCart) {
      emptyCart.style.display = "block";
    }

    if (cartBottom) {
      cartBottom.style.display = "none";
    }

  } else {

    if (emptyCart) {
      emptyCart.style.display = "none";
    }

    if (cartBottom) {
      cartBottom.style.display = "block";
    }
  }
}


/* =========================
   MODAL CARRITO
========================= */

function openCart() {

  if (!cartOverlay) return;

  cartOverlay.classList.add("show");
  cartOverlay.setAttribute("aria-hidden", "false");

  document.body.classList.add("locked");
}


function closeCart() {

  if (!cartOverlay) return;

  cartOverlay.classList.remove("show");
  cartOverlay.setAttribute("aria-hidden", "true");

  if (!afterOverlay?.classList.contains("show")) {
    document.body.classList.remove("locked");
  }
}


/* =========================
   MENSAJE DE AGREGADO
========================= */

let toastTimer = null;


function showAddedMessage(name) {

  const oldToast = document.querySelector(".toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");

  toast.className = "toast";

  toast.textContent = `${name} agregado al carrito`;

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
   PRUEBA
========================= */

function requestTrial(service) {

  const message =
`Hola! Quiero solicitar una prueba de ${service}.

¿Me pueden indicar cómo realizarla?`;

  const url =
    `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}


/* =========================
   CHECKOUT
========================= */

function checkout() {

  if (!cart.length) {
    if (cartError) {
      cartError.textContent = "Agregá al menos un producto.";
    }

    return;
  }


  const name = customerName?.value.trim() || "";
  const phone = customerPhone?.value.trim() || "";


  if (name.length < 2) {

    if (cartError) {
      cartError.textContent = "Ingresá tu nombre.";
    }

    customerName?.focus();

    return;
  }


  if (normalizePhone(phone).length < 8) {

    if (cartError) {
      cartError.textContent =
        "Ingresá un número de WhatsApp válido.";
    }

    customerPhone?.focus();

    return;
  }


  customer = {
    name,
    phone
  };


  try {
    localStorage.setItem(
      "personalnet_customer",
      JSON.stringify(customer)
    );
  } catch (error) {
    console.warn("No se pudo guardar el cliente.");
  }


  const message = createOrderMessage();


  const whatsappUrl =
    `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;


  try {
    localStorage.setItem(
      "personalnet_order",
      JSON.stringify(cart)
    );

    localStorage.setItem(
      "personalnet_order_wa",
      whatsappUrl
    );

  } catch (error) {
    console.warn("No se pudo guardar el pedido.");
  }


  /*
    Abrimos Mercado Pago.
    El usuario realiza el pago y después
    vuelve al sitio para enviar el comprobante.
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


/* =========================
   MENSAJE DEL PEDIDO
========================= */

function createOrderMessage() {

  let total = 0;

  let products = cart.map(item => {

    const quantity = Math.max(
      1,
      Number(item.quantity) || 1
    );

    const subtotal =
      Number(item.price) * quantity;

    total += subtotal;

    return `• ${item.name} x${quantity} — ${money(subtotal)}`;

  }).join("\n");


  return `Hola! Quiero confirmar mi compra en PERSONALNET.

👤 Cliente: ${customer.name}
📱 WhatsApp: ${customer.phone}

📦 Pedido:
${products}

💰 Total: ${money(total)}

💳 Mercado Pago:
${MP_LINK}

Ya realicé el pago y envío el comprobante por este medio.`;
}


/* =========================
   POST PAGO
========================= */

function showAfterPayment() {

  if (!afterOverlay) return;

  let whatsappUrl = "";

  try {
    whatsappUrl =
      localStorage.getItem("personalnet_order_wa") || "";
  } catch (error) {
    whatsappUrl = "";
  }


  if (sendWhatsApp) {

    sendWhatsApp.href =
      whatsappUrl ||
      `https://wa.me/${ADMIN_WHATSAPP}`;

  }


  afterOverlay.classList.add("show");
  afterOverlay.setAttribute("aria-hidden", "false");

  document.body.classList.add("locked");
}


function closeAfterPayment() {

  if (!afterOverlay) return;

  afterOverlay.classList.remove("show");
  afterOverlay.setAttribute("aria-hidden", "true");

  if (!cartOverlay?.classList.contains("show")) {
    document.body.classList.remove("locked");
  }
}


/* =========================
   EVENTOS
========================= */

document.getElementById("openCart")?.addEventListener(
  "click",
  openCart
);


document.getElementById("closeCart")?.addEventListener(
  "click",
  closeCart
);


document.getElementById("clearCart")?.addEventListener(
  "click",
  clearCart
);


document.getElementById("checkoutButton")?.addEventListener(
  "click",
  checkout
);


document.getElementById("closeAfter")?.addEventListener(
  "click",
  closeAfterPayment
);


/* =========================
   CERRAR HACIENDO CLICK AFUERA
========================= */

cartOverlay?.addEventListener(
  "click",
  event => {

    if (event.target === cartOverlay) {
      closeCart();
    }

  }
);


afterOverlay?.addEventListener(
  "click",
  event => {

    if (event.target === afterOverlay) {
      closeAfterPayment();
    }

  }
);


/* =========================
   ESC
========================= */

document.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Escape") return;

    if (afterOverlay?.classList.contains("show")) {
      closeAfterPayment();
      return;
    }

    if (cartOverlay?.classList.contains("show")) {
      closeCart();
    }

  }
);


/* =========================
   LIMPIAR ERROR AL ESCRIBIR
========================= */

customerName?.addEventListener(
  "input",
  () => {
    if (cartError) cartError.textContent = "";
  }
);


customerPhone?.addEventListener(
  "input",
  () => {
    if (cartError) cartError.textContent = "";
  }
);


/* =========================
   INICIO
========================= */

loadCart();
loadCustomer();
