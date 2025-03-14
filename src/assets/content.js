console.log("Content script loaded on", window.location.href);

(function () {
  // hold the currently focused input element
  let currentInput = null;

  // listen for focus events on input elements
  document.addEventListener("focusin", (e) => {
    if (e.target.matches('input, textarea, [contenteditable="true"]')) {
      currentInput = e.target;
    }
  });

  // function to fetch text from the current input element.
  // if nothing was focused, fall back to a general query.
  function getInputText() {
    if (currentInput) {
      return currentInput.value || currentInput.textContent || "";
    }
    const input = document.querySelector(
      'input, textarea, [contenteditable="true"]'
    );
    if (input) {
      return input.value || input.textContent || "";
    }
    return "";
  }

  // listen for messages requesting the input text.
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchInputText") {
      const text = getInputText();
      sendResponse({ text: text.trim() });
      return true; // keep channel open for asynchronous usage if needed
    }
  });
})();
