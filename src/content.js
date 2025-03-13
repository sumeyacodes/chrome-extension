// use IIFE (immediately invoked function) to create a clean scope & avoid polluting global scope
(function () {
  // tracking current focused input element, initially set to null
  let currentInput = null;

  // listens for focus events on input elements
  document.addEventListener("focusin", (e) => {
    if (e.target.matches('input, textarea, [contenteditable="true"]')) {
      currentInput = e.target;
    }
  });

  // handles messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchInputText") {
      let text = "";
      // get text from tracked input element
      if (currentInput) {
        text = currentInput?.value || currentInput?.textContent; // handles both regular inputs and contenteditables
      }
      sendResponse({ text: text.trim() }); // send response back to popup.js
      return true; //keep channel open for async response
    }
  });
})(); // IIFE ends here
