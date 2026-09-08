const MERCADO_PAGO =
  "https://link.mercadopago.com.ar/pirunet";

const WHATSAPP =
  "5493844546841";

let cart = [];

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const emptyCart = document.getElementById("emptyCart");

const openCart = document.getElementById("openCart");
const closeCart = document.getElementById("closeCart");

const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");

const mercadoPago = document.getElementById("mercadoPago");
const whatsappOrder = document.getElementById("whatsappOrder");
const clearCart = document.getElementById("clearCart");


/* =========================
   CARRITO
========================= */

function formatPrice(value) {
  return "$" + Number(value).toLocaleString("es-AR");
}

function updateCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    emptyCart.style.display = "grid";
  } else {
    emptyCart.style.display = "none";
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += Number(item.price);

    const element = document.createElement("div");
    element.className = "cart-item";

    element.innerHTML = `
      <div class="cart-item-top">
        <div>
          <h3>${escapeHTML(item.product)}</h3>
          <p>${escapeHTML(item.duration)}</p>
        </div>

        <div class="cart-item-price">
          ${formatPrice(item.price)}
        </div>
      </div>

      <button class="remove-item" data-index="${index}">
        Eliminar
      </button>
    `;

    cartItems.appendChild(element);
  });

  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = cart.length;

  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      cart.splice(index, 1);
      updateCart();
    });
  });
}


function addToCart(product, duration, price) {
  cart.push({
    product,
    duration,
    price: Number(price)
  });

  updateCart();
  openCartDrawer();
}


/* =========================
   ABRIR / CERRAR CARRITO
========================= */

function openCartDrawer() {
  cartDrawer.classList.add("show");
  cartOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {
  cartDrawer.classList.remove("show");
  cartOverlay.classList.remove("show");
  document.body.style.overflow = "";
}

openCart.addEventListener("click", openCartDrawer);
closeCart.addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", closeCartDrawer);


/* =========================
   BOTONES COMPRAR
========================= */

document.querySelectorAll(".buy-button").forEach(button => {

  button.addEventListener("click", () => {

    const product = button.dataset.product;
    const duration = button.dataset.duration;
    const price = button.dataset.price;

    addToCart(product, duration, price);

  });

});


/* =========================
   FILTROS
========================= */

const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".plan-card");

tabs.forEach(tab => {

  tab.addEventListener("click", () => {

    tabs.forEach(item => item.classList.remove("active"));
    tab.classList.add("active");

    const filter = tab.dataset.filter;

    cards.forEach(card => {

      if (filter === "all") {
        card.classList.remove("hidden");
        return;
      }

      const duration = card.dataset.duration;

      if (duration === filter) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }

    });

  });

});


/* =========================
   MERCADO PAGO
========================= */

mercadoPago.addEventListener("click", () => {

  if (cart.length === 0) {
    alert("Agregá al menos un plan al carrito.");
    return;
  }

  window.open(MERCADO_PAGO, "_blank");

});


/* =========================
   WHATSAPP
========================= */

whatsappOrder.addEventListener("click", () => {

  if (cart.length === 0) {
    alert("Agregá al menos un plan al carrito.");
    return;
  }

  const name = customerName.value.trim();
  const phone = customerPhone.value.trim();

  if (!name) {
    alert("Ingresá tu nombre.");
    customerName.focus();
    return;
  }

  if (!phone) {
    alert("Ingresá tu número de WhatsApp.");
    customerPhone.focus();
    return;
  }

  let total = 0;

  let message =
    "Hola PERSONALNET 👋%0A%0A" +
    "Quiero realizar una compra.%0A%0A" +
    "*Datos del cliente*%0A" +
    "Nombre: " + encodeURIComponent(name) + "%0A" +
    "Teléfono: " + encodeURIComponent(phone) + "%0A%0A" +
    "*Planes seleccionados*%0A";

  cart.forEach((item, index) => {

    total += Number(item.price);

    message +=
      "%0A" +
      (index + 1) + ". " +
      encodeURIComponent(item.product) +
      "%0A" +
      "Plan: " +
      encodeURIComponent(item.duration) +
      "%0A" +
      "Precio: " +
      encodeURIComponent(formatPrice(item.price));

  });

  message +=
    "%0A%0A*TOTAL: " +
    encodeURIComponent(formatPrice(total)) +
    "*%0A%0A" +
    "Quedo a la espera para continuar con la activación.";

  const url =
    "https://wa.me/" +
    WHATSAPP +
    "?text=" +
    message;

  window.open(url, "_blank");

});


/* =========================
   VACIAR
========================= */

clearCart.addEventListener("click", () => {

  if (cart.length === 0) return;

  const confirmClear =
    confirm("¿Querés vaciar todo el carrito?");

  if (!confirmClear) return;

  cart = [];
  updateCart();

});


/* =========================
   ESCAPE
========================= */

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeCartDrawer();
  }

});


/* =========================
   SEGURIDAD HTML
========================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================
   INICIO
========================= */

updateCart();
