/* =========================================================
   PERSONALNET - SCRIPT PRINCIPAL
   Carrito + Filtros + FAQ + Menú + Mercado Pago + WhatsApp
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =========================================================
     ELEMENTOS
     ========================================================= */

  const cart = [];

  const cartModal = document.getElementById("cartModal");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");

  const openCart = document.getElementById("openCart");
  const closeCart = document.getElementById("closeCart");

  const checkoutBtn = document.getElementById("checkoutBtn");
  const whatsappBtn = document.getElementById("whatsappBtn");

  const durationButtons = document.querySelectorAll("[data-filter]");
  const planCards = document.querySelectorAll(".plan-card");

  const faqItems = document.querySelectorAll(".faq-item");

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  const toast = document.getElementById("toast");


  /* =========================================================
     FORMATO DE PRECIOS
     ========================================================= */

  function money(value) {
    return "$" + Number(value).toLocaleString("es-AR");
  }


  /* =========================================================
     ESCAPAR HTML
     ========================================================= */

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }


  /* =========================================================
     NOTIFICACIÓN
     ========================================================= */

  function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.personalnetToast);

    window.personalnetToast = setTimeout(function () {
      toast.classList.remove("show");
    }, 2800);
  }


  /* =========================================================
     ABRIR CARRITO
     ========================================================= */

  function openCartModal() {

    if (!cartModal) return;

    cartModal.classList.add("show");

    document.body.classList.add("modal-open");
  }


  /* =========================================================
     CERRAR CARRITO
     ========================================================= */

  function closeCartModal() {

    if (!cartModal) return;

    cartModal.classList.remove("show");

    document.body.classList.remove("modal-open");
  }


  /* =========================================================
     MOSTRAR CARRITO
     ========================================================= */

  function renderCart() {

    if (!cartItems) return;

    cartItems.innerHTML = "";

    /* Carrito vacío */

    if (cart.length === 0) {

      cartItems.innerHTML = `
        <div class="cart-empty">

          <div class="cart-empty-icon">
            🛒
          </div>

          <h3>Tu carrito está vacío</h3>

          <p>
            Elegí un plan para comenzar.
          </p>

        </div>
      `;

    }

    /* Productos */

    else {

      cart.forEach(function (item, index) {

        const row = document.createElement("div");

        row.className = "cart-item";

        row.innerHTML = `

          <div class="cart-item-info">

            <strong>
              ${escapeHtml(item.name)}
            </strong>

            <span>
              ${escapeHtml(item.duration)}
              ${item.devices ? " · " + escapeHtml(item.devices) : ""}
            </span>

          </div>

          <div class="cart-item-right">

            <b>
              ${money(item.price)}
            </b>

            <button
              type="button"
              class="remove-item"
              data-index="${index}"
              aria-label="Eliminar producto"
            >
              ×
            </button>

          </div>

        `;

        cartItems.appendChild(row);

      });


      /* Botones eliminar */

      cartItems
        .querySelectorAll(".remove-item")
        .forEach(function (button) {

          button.addEventListener("click", function () {

            const index = Number(button.dataset.index);

            cart.splice(index, 1);

            renderCart();

            showToast("Plan eliminado");

          });

        });

    }


    /* Total */

    const total = cart.reduce(function (sum, item) {

      return sum + Number(item.price);

    }, 0);


    if (cartTotal) {

      cartTotal.textContent = money(total);

    }


    /* Cantidad */

    if (cartCount) {

      cartCount.textContent = cart.length;

    }

  }


  /* =========================================================
     AGREGAR AL CARRITO
     ========================================================= */

  function addToCart(
    name,
    duration,
    price,
    devices = ""
  ) {

    cart.push({

      name: name,

      duration: duration,

      price: Number(price),

      devices: devices

    });


    renderCart();

    openCartModal();

    showToast("Plan agregado al carrito");

  }


  /* IMPORTANTE:
     Permite usar onclick="addToCart(...)" desde el HTML */

  window.addToCart = addToCart;


  /* =========================================================
     BOTÓN ABRIR CARRITO
     ========================================================= */

  if (openCart) {

    openCart.addEventListener("click", function () {

      openCartModal();

    });

  }


  /* =========================================================
     BOTÓN CERRAR CARRITO
     ========================================================= */

  if (closeCart) {

    closeCart.addEventListener("click", function () {

      closeCartModal();

    });

  }


  /* =========================================================
     CERRAR CLICKEANDO FUERA
     ========================================================= */

  if (cartModal) {

    cartModal.addEventListener("click", function (event) {

      if (event.target === cartModal) {

        closeCartModal();

      }

    });

  }


  /* =========================================================
     CERRAR CON ESC
     ========================================================= */

  document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

      closeCartModal();

    }

  });


  /* =========================================================
     FILTRO DE DURACIÓN
     Todos / 7 / 15 / 30
     ========================================================= */

  durationButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      durationButtons.forEach(function (btn) {

        btn.classList.remove("active");

      });


      button.classList.add("active");


      const filter = button.dataset.filter;


      planCards.forEach(function (card) {

        /* Mostrar todos */

        if (filter === "all") {

          card.classList.remove("hidden");

          card
            .querySelectorAll("[data-duration]")
            .forEach(function (option) {

              option.classList.remove("hidden");

            });

          return;

        }


        /* Buscar opciones */

        const options =
          card.querySelectorAll("[data-duration]");


        let visible = false;


        options.forEach(function (option) {

          const match =
            option.dataset.duration === filter;


          option.classList.toggle(
            "hidden",
            !match
          );


          if (match) {

            visible = true;

          }

        });


        card.classList.toggle(
          "hidden",
          !visible
        );

      });

    });

  });


  /* =========================================================
     FAQ
     ========================================================= */

  faqItems.forEach(function (item) {

    const question =
      item.querySelector(".faq-question");


    if (!question) return;


    question.addEventListener("click", function () {

      const isOpen =
        item.classList.contains("open");


      /* Cerrar todos */

      faqItems.forEach(function (other) {

        other.classList.remove("open");

      });


      /* Abrir seleccionado */

      if (!isOpen) {

        item.classList.add("open");

      }

    });

  });


  /* =========================================================
     MENÚ MÓVIL
     ========================================================= */

  if (menuToggle) {

    menuToggle.addEventListener("click", function () {

      if (navMenu) {

        navMenu.classList.toggle("open");

      }

      menuToggle.classList.toggle("active");

    });

  }


  /* =========================================================
     CERRAR MENÚ AL TOCAR UN ENLACE
     ========================================================= */

  if (navMenu) {

    navMenu
      .querySelectorAll("a")
      .forEach(function (link) {

        link.addEventListener("click", function () {

          navMenu.classList.remove("open");

          if (menuToggle) {

            menuToggle.classList.remove("active");

          }

        });

      });

  }


  /* =========================================================
     MERCADO PAGO
     ========================================================= */

  if (checkoutBtn) {

    checkoutBtn.addEventListener("click", function () {

      if (cart.length === 0) {

        showToast(
          "Primero elegí un plan."
        );

        return;

      }


      window.open(
        "https://link.mercadopago.com.ar/pirunet",
        "_blank",
        "noopener,noreferrer"
      );


      showToast(
        "Mercado Pago se abrió."
      );

    });

  }


  /* =========================================================
     WHATSAPP
     ========================================================= */

  if (whatsappBtn) {

    whatsappBtn.addEventListener(
      "click",
      function () {

        if (cart.length === 0) {

          showToast(
            "Primero elegí un plan."
          );

          return;

        }


        const lines =
          cart.map(function (item) {

            return (
              "• " +
              item.name +
              " — " +
              item.duration +
              (item.devices
                ? " — " + item.devices
                : "") +
              " — " +
              money(item.price)
            );

          });


        const total =
          cart.reduce(function (
            sum,
            item
          ) {

            return sum + Number(item.price);

          }, 0);


        const message =

          "Hola PERSONALNET 👋\n\n" +

          "Quiero contratar estos planes:\n\n" +

          lines.join("\n") +

          "\n\nTotal: " +

          money(total) +

          "\n\n" +

          "Quedo atento/a para continuar con la activación.";


        const whatsappURL =

          "https://wa.me/5493844546841?text=" +

          encodeURIComponent(message);


        window.open(
          whatsappURL,
          "_blank",
          "noopener,noreferrer"
        );

      }
    );

  }


  /* =========================================================
     SCROLL SUAVE
     ========================================================= */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(function (link) {

      link.addEventListener(
        "click",
        function (event) {

          const id =
            link.getAttribute("href");


          if (!id || id === "#") {

            return;

          }


          const target =
            document.querySelector(id);


          if (!target) {

            return;

          }


          event.preventDefault();


          target.scrollIntoView({

            behavior: "smooth",

            block: "start"

          });

        }
      );

    });


  /* =========================================================
     INICIALIZAR
     ========================================================= */

  renderCart();

});
