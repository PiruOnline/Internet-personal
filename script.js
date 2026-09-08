/* =========================================
   PERSONALNET
   SISTEMA DE CARRITO + WHATSAPP
========================================= */

const products = {

  "cg-personal-7": {
    name: "CGLite Personal",
    info: "7 días · Línea Personal",
    days: 7,
    price: 4500
  },

  "cg-personal-15": {
    name: "CGLite Personal",
    info: "15 días · Línea Personal",
    days: 15,
    price: 6000
  },

  "cg-personal-30": {
    name: "CGLite Personal",
    info: "30 días · Línea Personal",
    days: 30,
    price: 8000
  },

  "cg-claro-7": {
    name: "CGLite Claro AR",
    info: "7 días · Línea Claro",
    days: 7,
    price: 4500
  },

  "cg-claro-15": {
    name: "CGLite Claro AR",
    info: "15 días · Línea Claro",
    days: 15,
    price: 6000
  },

  "cg-claro-30": {
    name: "CGLite Claro AR",
    info: "30 días · Línea Claro",
    days: 30,
    price: 8000
  },

  "http-1": {
    name: "HTTP Custom Personal",
    info: "30 días · 1 dispositivo",
    days: 30,
    price: 7000
  },

  "http-2": {
    name: "HTTP Custom Personal",
    info: "30 días · 2 dispositivos",
    days: 30,
    price: 12000
  }

};


/* =========================================
   ESTADO
========================================= */

let cart = [];


/* =========================================
   ELEMENTOS
========================================= */

const cartElement = document.getElementById("cart");
const cartOverlay = document.getElementById("cartOverlay");
const openCartButton = document.getElementById("openCart");
const closeCartButton = document.getElementById("closeCart");

const cartItemsElement = document.getElementById("cartItems");
const cartCountElement = document.getElementById("cartCount");
const cartTotalElement = document.getElementById("cartTotal");

const clearCartButton = document.getElementById("clearCart");
const whatsappButton = document.getElementById("whatsappButton");

const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");

const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");


/* =========================================
   FORMATO PRECIO
========================================= */

function formatPrice(value) {

  return "$" + value.toLocaleString("es-AR");

}


/* =========================================
   ABRIR CARRITO
========================================= */

function openCart() {

  cartElement.classList.add("active");
  cartOverlay.classList.add("active");

  document.body.classList.add("cart-open");

}


/* =========================================
   CERRAR CARRITO
========================================= */

function closeCart() {

  cartElement.classList.remove("active");
  cartOverlay.classList.remove("active");

  document.body.classList.remove("cart-open");

}


/* =========================================
   EVENTOS CARRITO
========================================= */

openCartButton.addEventListener("click", openCart);

closeCartButton.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);


/* =========================================
   AGREGAR PRODUCTO
========================================= */

document.querySelectorAll(".buy-button").forEach(button => {

  button.addEventListener("click", () => {

    const productId = button.dataset.product;

    if (!products[productId]) {
      return;
    }

    cart.push(productId);

    updateCart();

    showToast(products[productId].name);

    openCart();

  });

});


/* =========================================
   ACTUALIZAR CARRITO
========================================= */

function updateCart() {

  cartCountElement.textContent = cart.length;

  const total = cart.reduce((sum, productId) => {

    return sum + products[productId].price;

  }, 0);

  cartTotalElement.textContent = formatPrice(total);


  if (cart.length === 0) {

    cartItemsElement.innerHTML = `

      <div class="empty-cart">

        <div class="empty-icon">
          🛒
        </div>

        <h3>
          Tu carrito está vacío
        </h3>

        <p>
          Agregá un plan para comenzar tu pedido.
        </p>

      </div>

    `;

    return;

  }


  cartItemsElement.innerHTML = "";


  cart.forEach((productId, index) => {

    const product = products[productId];

    const item = document.createElement("div");

    item.className = "cart-item";

    item.innerHTML = `

      <div>

        <h4>
          ${product.name}
        </h4>

        <p>
          ${product.info}
        </p>

        <div class="cart-item-price">
          ${formatPrice(product.price)}
        </div>

      </div>

      <button
        class="remove-item"
        type="button"
        data-index="${index}">
        ×
      </button>

    `;

    cartItemsElement.appendChild(item);

  });


  document.querySelectorAll(".remove-item").forEach(button => {

    button.addEventListener("click", () => {

      const index = Number(button.dataset.index);

      cart.splice(index, 1);

      updateCart();

    });

  });

}


/* =========================================
   VACIAR CARRITO
========================================= */

clearCartButton.addEventListener("click", () => {

  if (cart.length === 0) {
    return;
  }

  cart = [];

  updateCart();

});


/* =========================================
   TOAST
========================================= */

let toastTimer;

function showToast(productName) {

  toastText.textContent =
    `${productName} agregado correctamente.`;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 2800);

}


/* =========================================
   WHATSAPP
========================================= */

whatsappButton.addEventListener("click", () => {

  if (cart.length === 0) {

    alert("Primero agregá al menos un plan al carrito.");

    return;
  }


  const name = customerName.value.trim();
  const phone = customerPhone.value.trim();


  if (!name) {

    customerName.focus();

    alert("Ingresá tu nombre.");

    return;
  }


  if (!phone) {

    customerPhone.focus();

    alert("Ingresá tu número de teléfono.");

    return;
  }


  const total = cart.reduce((sum, productId) => {

    return sum + products[productId].price;

  }, 0);


  const lines = cart.map(productId => {

    const product = products[productId];

    return `• ${product.name} — ${product.info} — ${formatPrice(product.price)}`;

  });


  const message = `Hola PERSONALNET 👋

Quiero realizar este pedido:

${lines.join("\n")}

━━━━━━━━━━━━━━

Total: ${formatPrice(total)}
Nombre: ${name}
Teléfono: ${phone}`;


  const url =
    "https://wa.me/5493844546841?text=" +
    encodeURIComponent(message);


  window.open(url, "_blank");

});


/* =========================================
   FILTROS
========================================= */

const filters = document.querySelectorAll(".filter");
const planCards = document.querySelectorAll(".plan-card");


filters.forEach(filter => {

  filter.addEventListener("click", () => {

    filters.forEach(item => {
      item.classList.remove("active");
    });

    filter.classList.add("active");


    const selected = filter.dataset.filter;


    planCards.forEach(card => {

      const days = card.dataset.days;

      if (selected === "all" || selected === days) {

        card.classList.remove("filtered-out");

        requestAnimationFrame(() => {

          card.style.animation =
            "filterIn .35s cubic-bezier(.22,1,.36,1)";

        });

      } else {

        card.classList.add("filtered-out");

      }

    });

  });

});


/* =========================================
   ANIMACIÓN FILTROS
========================================= */

const filterStyle = document.createElement("style");

filterStyle.textContent = `

@keyframes filterIn {

  from {
    opacity: 0;
    transform: translateY(10px) scale(.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

}

`;

document.head.appendChild(filterStyle);


/* =========================================
   REVEAL AL HACER SCROLL
========================================= */

const revealElements =
  document.querySelectorAll(".reveal");


const revealObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");

        revealObserver.unobserve(entry.target);

      });

    },

    {
      threshold: .12
    }

  );


revealElements.forEach(element => {

  revealObserver.observe(element);

});


/* =========================================
   ANIMACIÓN ESCALONADA
========================================= */

document.querySelectorAll(
  ".plans-grid .plan-card"
).forEach((card, index) => {

  card.style.transitionDelay =
    `${Math.min(index * 45, 250)}ms`;

});


document.querySelectorAll(
  ".service-grid .service-card"
).forEach((card, index) => {

  card.style.transitionDelay =
    `${index * 80}ms`;

});


/* =========================================
   ESC PARA CERRAR
========================================= */

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {

    closeCart();

  }

});


/* =========================================
   NAVEGACIÓN SUAVE
========================================= */

document.querySelectorAll(
  'a[href^="#"]'
).forEach(link => {

  link.addEventListener("click", event => {

    const targetId =
      link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target =
      document.querySelector(targetId);

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


/* =========================================
   INICIALIZAR
========================================= */

updateCart();
