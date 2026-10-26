/* =========================
   NAVIGATION
========================= */

document.addEventListener("DOMContentLoaded", function () {

  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector("nav");

  // Mobile menu
  if (menuToggle && siteNav) {
      menuToggle.addEventListener("click", function () {
          siteNav.classList.toggle("show");
      });
  }

  // Highlight current page in navigation
  const currentPage = window.location.pathname
      .split("/")
      .pop() || "index.html";

  document.querySelectorAll("nav a").forEach(function (link) {
      const linkPage = link.getAttribute("href");

      if (linkPage === currentPage) {
          link.classList.add("active");
      }
  });


  /* =========================
     CONTACT FORM
  ========================= */

  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
      contactForm.addEventListener("submit", function (event) {
          event.preventDefault();

          alert(
              "Thank you for contacting ColorCraft! " +
              "Your message has been received."
          );

          contactForm.reset();
      });
  }


  /* =========================
     ORDER PAGE
  ========================= */

  const palette = document.getElementById("colourPalette");

  // Order code runs only on the Order page
  if (palette) {

      const preview = document.getElementById("colourPreview");
      const nameDisplay = document.getElementById("colourName");
      const codeDisplay = document.getElementById("colourCode");
      const quantityInput = document.getElementById("quantity");
      const addButton = document.getElementById("addColour");
      const orderList = document.getElementById("orderList");
      const totalQuantity = document.getElementById("totalQuantity");
      const orderForm = document.getElementById("orderForm");
      const orderStatus = document.getElementById("orderStatus");

      // Paint colour collection
      const shades = [
          { name: "Ocean Blue", code: "#0878D1" },
          { name: "Sky Blue", code: "#87CEEB" },
          { name: "Royal Blue", code: "#4169E1" },
          { name: "Navy Blue", code: "#000080" },
          { name: "Teal Green", code: "#008080" },

          { name: "Fresh Green", code: "#00C878" },
          { name: "Leaf Green", code: "#228B22" },
          { name: "Lime Green", code: "#A9E52C" },
          { name: "Mint Green", code: "#98FF98" },
          { name: "Olive Green", code: "#808000" },

          { name: "Sunshine Yellow", code: "#FFF000" },
          { name: "Golden Yellow", code: "#FFD700" },
          { name: "Orange", code: "#FFA500" },
          { name: "Coral", code: "#FF7F50" },
          { name: "Red", code: "#FF0000" },

          { name: "Rose Pink", code: "#FF69B4" },
          { name: "Light Pink", code: "#FFB6C1" },
          { name: "Lavender", code: "#E6E6FA" },
          { name: "Purple", code: "#800080" },
          { name: "Violet", code: "#8F00FF" },

          { name: "Chocolate Brown", code: "#7B3F00" },
          { name: "Cream", code: "#FFFDD0" },
          { name: "White", code: "#FFFFFF" },
          { name: "Grey", code: "#808080" },
          { name: "Black", code: "#000000" }
      ];

      let selectedShade = shades[0];

      // Cart items
      const cart = [];


      /* =========================
         DISPLAY COLOUR PALETTE
      ========================= */

      function displayPalette() {

          palette.innerHTML = "";

          shades.forEach(function (shade, index) {

              const button = document.createElement("button");

              button.type = "button";
              button.className = "colour-swatch";
              button.style.backgroundColor = shade.code;
              button.title = shade.name;
              button.setAttribute(
                  "aria-label",
                  shade.name + " " + shade.code
              );

              if (index === 0) {
                  button.classList.add("selected");
              }

              button.addEventListener("click", function () {
                  selectShade(shade, button);
              });

              palette.appendChild(button);
          });

          updatePreview();
      }


      /* =========================
         SELECT COLOUR
      ========================= */

      function selectShade(shade, selectedButton) {

          selectedShade = shade;

          document.querySelectorAll(".colour-swatch").forEach(
              function (button) {
                  button.classList.remove("selected");
              }
          );

          selectedButton.classList.add("selected");

          updatePreview();
      }


      /* =========================
         UPDATE COLOUR PREVIEW
      ========================= */

      function updatePreview() {

          if (preview) {
              preview.style.backgroundColor = selectedShade.code;
          }

          if (nameDisplay) {
              nameDisplay.textContent = selectedShade.name;
          }

          if (codeDisplay) {
              codeDisplay.textContent = selectedShade.code;
          }
      }


      /* =========================
         ADD COLOUR TO ORDER
      ========================= */

      if (addButton) {

          addButton.addEventListener("click", function () {

              const quantity = Number(quantityInput.value);

              if (!Number.isInteger(quantity) || quantity < 1) {
                  alert("Please enter a valid quantity.");
                  return;
              }

              const existingItem = cart.find(function (item) {
                  return item.code === selectedShade.code;
              });

              if (existingItem) {
                  existingItem.quantity += quantity;
              } else {
                  cart.push({
                      name: selectedShade.name,
                      code: selectedShade.code,
                      quantity: quantity
                  });
              }

              quantityInput.value = 1;

              renderCart();
              showOrderStatus("", "");

              alert(selectedShade.name + "  added to your order!")
          });
      }


      /* =========================
         DISPLAY ORDER LIST
      ========================= */

      function renderCart() {

          if (!orderList) {
              return;
          }

          orderList.innerHTML = "";

          let total = 0;

          cart.forEach(function (item, index) {

              total += item.quantity;

              const listItem = document.createElement("li");

              const itemInfo = document.createElement("div");
              itemInfo.className = "order-item-info";

              const swatch = document.createElement("span");
              swatch.className = "order-item-swatch";
              swatch.style.backgroundColor = item.code;

              const details = document.createElement("div");

              const itemName = document.createElement("strong");
              itemName.textContent = item.name;

              const itemQuantity = document.createElement("p");
              itemQuantity.textContent =
                  "Quantity: " + item.quantity;

              const itemCode = document.createElement("small");
              itemCode.textContent = item.code;

              details.appendChild(itemName);
              details.appendChild(itemQuantity);
              details.appendChild(itemCode);

              itemInfo.appendChild(swatch);
              itemInfo.appendChild(details);

              const removeButton = document.createElement("button");
              removeButton.type = "button";
              removeButton.className = "remove-item";
              removeButton.textContent = "Remove";

              removeButton.addEventListener("click", function () {
                  cart.splice(index, 1);
                  renderCart();
              });

              listItem.appendChild(itemInfo);
              listItem.appendChild(removeButton);

              orderList.appendChild(listItem);
          });

          if (totalQuantity) {
              totalQuantity.textContent = total;
          }
      }


      /* =========================
         ORDER STATUS MESSAGE
      ========================= */

      function showOrderStatus(message, type) {

          if (!orderStatus) {
              return;
          }

          orderStatus.textContent = message;
          orderStatus.className = "order-status";

          if (message) {
              orderStatus.classList.add(type);
          }
      }


      /* =========================
         SUBMIT ORDER
      ========================= */

      if (orderForm) {

          orderForm.addEventListener("submit", function (event) {

              event.preventDefault();

              const customerName =
                  document.getElementById("customerName");

              const customerPhone =
                  document.getElementById("customerPhone");

              const customerAddress =
                  document.getElementById("customerAddress");

              if (cart.length === 0) {
                  showOrderStatus(
                      "Please add at least one paint colour to your order.",
                      "error"
                  );
                  return;
              }

              if (
                  !customerName ||
                  !customerPhone ||
                  !customerAddress
              ) {
                  showOrderStatus(
                      "Please check the customer form fields in order.html.",
                      "error"
                  );
                  return;
              }

              if (
                  customerName.value.trim() === "" ||
                  customerPhone.value.trim() === "" ||
                  customerAddress.value.trim() === ""
              ) {
                  showOrderStatus(
                      "Please fill in all customer details.",
                      "error"
                  );
                  return;
              }

              // Demo order summary
              const orderDetails = {
                  customer: customerName.value.trim(),
                  phone: customerPhone.value.trim(),
                  address: customerAddress.value.trim(),
                  colours: cart.map(function (item) {
                      return {
                          name: item.name,
                          colourCode: item.code,
                          quantity: item.quantity
                      };
                  })
              };

              console.log("ColorCraft Order:", orderDetails);

              showOrderStatus(
                  "Thank you, " +
                  customerName.value.trim() +
                  "! Your order has been prepared successfully.",
                  "success"
              );

              alert(
                  "Thank you for choosing ColorCraft!\n\n" +
                  "Your order has been prepared.\n"
              );

              orderForm.reset();

              cart.length = 0;

              renderCart();
          });
      }


      // Load palette and empty cart
      displayPalette();
      renderCart();

  }

});