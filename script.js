/* ==========================================
   PERSONALNET
   Carrito + Mercado Pago + WhatsApp
========================================== */


const cart = [];

const MERCADO_PAGO_URL =
  "https://link.mercadopago.com.ar/pirunet";

const WHATSAPP_NUMBER =
  "5493844546841";


/* ==========================================
   ELEMENTOS
========================================== */

const openCartButton = document.getElementById("openCart");
const closeCartButton = document.getElementById("closeCart");

const cartModal = document.getElementById("cartModal");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");

const checkoutButton = document.getElementById("checkoutBtn");
const whatsappButton = document.getElementById("whatsappBtn");
const clearCartButton = document.getElementById("clearCart");

const toastElement = document.getElementById("toast");


/* ==========================================
   FORMATO DE DINERO
========================================== */

function money(value) {
  return "$" + Number(value).toLocaleString("es-AR");
}


/* ==========================================
   TOAST
========================================== */

let toastTimer;

function showToast(message) {

  toastElement.textContent = message;
  toastElement.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2200);
}


/* ==========================================
   AGREGAR AL CARRITO
========================================== */

function addToCart(product, detail, price) {

  cart.push({
    id: Date.now() + Math.random(),
    product,
    detail,
    price
  });

  renderCart();

  openCart();

  showToast("Plan agregado al carrito");
}


/* ==========================================
   ELIMINAR PRODUCTO
========================================== */

function removeItem(id) {

  const index = cart.findIndex(item => item.id === id);

  if (index !== -1) {
    cart.splice(index, 1);
  }

  renderCart();

  showToast("Producto eliminado");
}


/* ==========================================
   RENDERIZAR CARRITO
========================================== */

function renderCart() {

  cartCount.textContent = cart.length;

  if (cart.length === 0) {

    cartItems.innerHTML = `
      <div class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h3>Tu carrito está vacío</h3>
        <p>Agregá un plan para comenzar.</p>
      </div>
    `;

    cartTotal.textContent = "$0";

    return;
  }


  let total = 0;

  cartItems.innerHTML = "";


  cart.forEach(item => {

    total += Number(item.price);


    const element = document.createElement("div");

    element.className = "cart-item";


    element.innerHTML = `
      <div class="cart-item-info">

        <div class="cart-item-name">
          ${escapeHTML(item.product)}
        </div>

        <div class="cart-item-detail">
          ${escapeHTML(item.detail)}
        </div>

        <div class="cart-item-price">
          ${money(item.price)}
        </div>

      </div>

      <button
        class="remove-item"
        aria-label="Eliminar producto"
        data-id="${item.id}"
      >
        ×
      </button>
    `;


    const removeButton =
      element.querySelector(".remove-item");


    removeButton.addEventListener("click", () => {
      removeItem(item.id);
    });


    cartItems.appendChild(element);

  });


  cartTotal.textContent = money(total);
}


/* ==========================================
   TOTAL
========================================== */

function getTotal() {

  return cart.reduce(
    (total, item) => total + Number(item.price),
    0
  );

}


/* ==========================================
   ABRIR CARRITO
========================================== */

function openCart() {

  cartModal.classList.add("active");

  document.body.classList.add("cart-open");

}


/* ==========================================
   CERRAR CARRITO
========================================== */

function closeCart() {

  cartModal.classList.remove("active");

  document.body.classList.remove("cart-open");

}


/* ==========================================
   BOTONES CARRITO
========================================== */

openCartButton.addEventListener("click", openCart);

closeCartButton.addEventListener("click", closeCart);


/* ==========================================
   CERRAR HACIENDO CLICK AFUERA
========================================== */

cartModal.addEventListener("click", event => {

  if (event.target === cartModal) {
    closeCart();
  }

});


/* ==========================================
   ESC PARA CERRAR
========================================== */

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeCart();
  }

});


/* ==========================================
   MERCADO PAGO
========================================== */

checkoutButton.addEventListener("click", () => {

  if (cart.length === 0) {
    showToast("Primero agregá un plan al carrito");
    return;
  }


  const name = customerName.value.trim();
  const phone = customerPhone.value.trim();


  if (!name) {
    customerName.focus();
    showToast("Ingresá tu nombre");
    return;
  }


  if (!phone) {
    customerPhone.focus();
    showToast("Ingresá tu teléfono");
    return;
  }


  window.open(
    MERCADO_PAGO_URL,
    "_blank",
    "noopener,noreferrer"
  );

});


/* ==========================================
   WHATSAPP
========================================== */

whatsappButton.addEventListener("click", () => {

  if (cart.length === 0) {
    showToast("Primero agregá un plan al carrito");
    return;
  }


  const name = customerName.value.trim();
  const phone = customerPhone.value.trim();


  if (!name) {
    customerName.focus();
    showToast("Ingresá tu nombre");
    return;
  }


  if (!phone) {
    customerPhone.focus();
    showToast("Ingresá tu teléfono");
    return;
  }


  const total = getTotal();


  let message =
    "Hola PERSONALNET 👋\n\n" +
    "Quiero realizar una compra.\n\n";


  message +=
    "👤 Nombre: " +
    name +
    "\n";


  message +=
    "📱 Teléfono: " +
    phone +
    "\n\n";


  message += "📦 *Pedido:*\n";


  cart.forEach((item, index) => {

    message +=
      `${index + 1}. ${item.product}\n` +
      `   ${item.detail}\n` +
      `   ${money(item.price)}\n\n`;

  });


  message +=
    "💰 *Total: " +
    money(total) +
    "*\n\n";


  message +=
    "Ya realicé / voy a realizar el pago mediante Mercado Pago.";


  const whatsappURL =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);


  window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );

});


/* ==========================================
   VACIAR CARRITO
========================================== */

clearCartButton.addEventListener("click", () => {

  if (cart.length === 0) {
    showToast("El carrito ya está vacío");
    return;
  }


  cart.length = 0;

  renderCart();

  showToast("Carrito vaciado");

});


/* ==========================================
   FILTROS DE DURACIÓN
========================================== */

const filters =
  document.querySelectorAll(".filter");


const planCards =
  document.querySelectorAll(".plan-card");


filters.forEach(filter => {

  filter.addEventListener("click", () => {

    filters.forEach(button => {
      button.classList.remove("active");
    });


    filter.classList.add("active");


    const selected =
      filter.dataset.filter;


    planCards.forEach(card => {

      const options =
        card.querySelectorAll(".option");


      let visibleOptions = 0;


      options.forEach(option => {

        const duration =
          option.dataset.duration;


        if (
          selected === "todos" ||
          duration === selected
        ) {

          option.style.display = "";

          visibleOptions++;

        } else {

          option.style.display = "none";

        }

      });


      if (visibleOptions === 0) {
        card.style.display = "none";
      } else {
        card.style.display = "";
      }

    });

  });

});


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* ==========================================
   SCROLL SUAVE DE LOS ENLACES
========================================== */

document.querySelectorAll('a[href^="#"]').forEach(link => {

  link.addEventListener("click", event => {

    const targetID =
      link.getAttribute("href");


    if (!targetID || targetID === "#") {
      return;
    }


    const target =
      document.querySelector(targetID);


    if (!target) {
      return;
    }


    event.preventDefault();


    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});


/* ==========================================
   INICIO
========================================== */

renderCart();
