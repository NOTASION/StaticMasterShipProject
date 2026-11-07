/* ============================================================
   Site JS — mobile navigation, active links, current year
   ============================================================ */
(function () {
  "use strict";

  // ---- Accessible, viewport-aware mobile navigation ----
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");
  var previousBodyOverflow = null;
  var isPersian = (document.documentElement.lang || "").toLowerCase().indexOf("fa") === 0;

  if (toggle && menu) {
    var mobileQuery = window.matchMedia ? window.matchMedia("(max-width: 860px)") : null;
    var openLabel = isPersian ? "فهرست" : "Menu";
    var closeLabel = isPersian ? "بستن فهرست" : "Close menu";

    function setMenuOpen(open, returnFocus) {
      if (open) {
        if (previousBodyOverflow === null) {
          previousBodyOverflow = document.body.style.overflow;
        }
        document.body.style.overflow = "hidden";
      } else if (previousBodyOverflow !== null) {
        document.body.style.overflow = previousBodyOverflow;
        previousBodyOverflow = null;
      }

      menu.classList.toggle("open", open);
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? closeLabel : openLabel);

      if (!open && returnFocus) {
        toggle.focus();
      }
    }

    toggle.addEventListener("click", function () {
      setMenuOpen(!menu.classList.contains("open"), false);
    });

    menu.addEventListener("click", function (event) {
      var link = event.target.closest("a[href]");
      if (link) setMenuOpen(false, false);
    });

    document.addEventListener("click", function (event) {
      if (!menu.classList.contains("open")) return;
      if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        setMenuOpen(false, false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("open")) {
        setMenuOpen(false, true);
      }
    });

    function handleViewportChange(event) {
      if (!event.matches) setMenuOpen(false, false);
    }

    if (mobileQuery) {
      if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", handleViewportChange);
      } else if (typeof mobileQuery.addListener === "function") {
        mobileQuery.addListener(handleViewportChange);
      }
    } else {
      window.addEventListener("resize", function () {
        if (window.innerWidth > 860) setMenuOpen(false, false);
      });
    }

    // Browsers may restore a page from the back-forward cache.
    window.addEventListener("pageshow", function () {
      if (!menu.classList.contains("open")) {
        document.body.style.overflow = previousBodyOverflow === null ? "" : previousBodyOverflow;
        previousBodyOverflow = null;
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", openLabel);
        menu.setAttribute("aria-hidden", "true");
      }
    });
  }

  // ---- Active nav link by current path ----
  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-menu a.nav-link").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href && href.indexOf("#") !== 0) {
      var target = href.split("/").pop();
      if (target === path) a.classList.add("active");
    }
  });

  // ---- Current year in footer ----
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
