const cart = [];

const MP = "https://link.mercadopago.com.ar/pirunet";
const WHATSAPP = "5493844546841";

const $ = id => document.getElementById(id);

function money(n) {
  return "$" + n.toLocaleString("es-AR");
}

function toast(text) {
  const t = $("toast");
  t.textContent = text;
  t.classList.add("show");

  setTimeout(() => {
    t.classList.remove("show");
  }, 2200);
}

function addToCart(name, duration, price) {
  cart.push({
    name,
    duration,
    price
  });

  renderCart();
  $("cartModal").classList.add("show");
  toast("Plan agregado al carrito");
}

function renderCart() {
  const box = $("cartItems");

  $("cartCount").textContent = cart.length;

  if (!cart.length) {
    box.innerHTML = "<p style='color:#89948d'>Tu carrito está vacío.</p>";
    $("cartTotal").textContent = "$0";
    return;
  }

  box.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <small>${item.duration}</small>
        <strong>${money(item.price)}</strong>
      </div>

      <button class="remove" onclick="removeItem(${index})">×</button>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  $("cartTotal").textContent = money(total);
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

$("openCart").onclick = () => {
  $("cartModal").classList.add("show");
};

$("closeCart").onclick = () => {
  $("cartModal").classList.remove("show");
};

$("clearCart").onclick = () => {
  cart.length = 0;
  renderCart();
  toast("Carrito vaciado");
};

$("checkoutBtn").onclick = () => {
  if (!cart.length) {
    toast("Agregá un plan primero");
    return;
  }

  window.open(MP, "_blank");
};

$("whatsappBtn").onclick = () => {
  if (!cart.length) {
    toast("Agregá un plan primero");
    return;
  }

  const name = $("customerName").value.trim() || "Cliente";
  const phone = $("customerPhone").value.trim() || "No indicado";

  const products = cart.map(item =>
    `• ${item.name} - ${item.duration} - ${money(item.price)}`
  ).join("\n");

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const message =
`Hola PERSONALNET 👋

Quiero realizar una compra.

Nombre: ${name}
Teléfono: ${phone}

Planes:
${products}

Total: ${money(total)}

Quedo atento/a para continuar con la activación.`;

  window.open(
    "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message),
    "_blank"
  );
};


/* FILTROS */

document.querySelectorAll("[data-filter]").forEach(button => {

  button.onclick = () => {

    document.querySelectorAll("[data-filter]")
      .forEach(b => b.classList.remove("active"));

    button.classList.add("active");

    const filter = button.dataset.filter;

    document.querySelectorAll(".plan-card").forEach(card => {

      let visible = false;

      card.querySelectorAll(".option").forEach(option => {

        const show =
          filter === "all" ||
          option.dataset.duration === filter;

        option.classList.toggle("hidden", !show);

        if (show) visible = true;
      });

      card.classList.toggle("hidden", !visible);
    });
  };
});


/* CERRAR CARRITO AL TOCAR AFUERA */

$("cartModal").onclick = e => {
  if (e.target === $("cartModal")) {
    $("cartModal").classList.remove("show");
  }
};

renderCart();
