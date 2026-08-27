// Makes a dead page say so.
//
// If main.js throws while its module graph evaluates — a CSP that blocks
// something it needs, a browser extension, a bad deploy — no listener is ever
// registered and the page just sits there: buttons that do nothing, no
// message, nothing in the UI pointing at the cause. That failure cost a
// debugging round trip once; this file exists so it announces itself instead.
//
// A classic script (no build step, no imports) loaded BEFORE the module, so
// its handlers are already installed when the module fails.
(function () {
  "use strict";

  function show(detail) {
    var box = document.getElementById("status");
    if (!box) return;
    box.textContent =
      "This page failed to load properly, so validation is not available: " +
      detail +
      " — reloading may help; if it does not, please report it.";
    box.dataset.tone = "error";
    box.hidden = false;
  }

  window.addEventListener("error", function (event) {
    show(event.message || String(event.error));
  });

  window.addEventListener("unhandledrejection", function (event) {
    show(String((event.reason && event.reason.message) || event.reason));
  });
})();
