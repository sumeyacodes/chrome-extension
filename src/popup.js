document.addEventListener("DOMContentLoaded", () => {
  // get html elements
  const savedText = document.getElementById("savedText");
  const clearBtn = document.getElementById("clearButton");
  const fetchBtn = document.getElementById("fetchInputText");

  // load saved text from Chrome storage when popup opens
  chrome.storage.local.get(["savedText"], (result) => {
    savedText.textContent = result.savedText || "No text stored"; // Default if nothing is saved
  });

  // clear stored text when button is clicked
  clearBtn.addEventListener("click", () => {
    chrome.storage.local.remove("savedText", () => {
      savedText.textContent = "Text cleared!"; // Show confirmation message
      setTimeout(() => {
        savedText.textContent = "No text stored"; // Reset message after 2 seconds
      }, 2000);
    });
  });

  // fetch button handler for fetching text from the current input field
  fetchBtn.addEventListener("click", async () => {
    try {
      // request text from background.js
      const response = await chrome.runtime.sendMessage({
        action: "fetchInputText",
      });

      // handle response
      if (response?.error) {
        savedText.textContent = response.error;
      } else if (response?.text) {
        const formatted = response.text; // display text
        savedText.textContent = formatted;
        chrome.storage.local.set({ savedText: formatted }); // save to storage
      } else {
        savedText.textContent = "No text found in the current input field";
      }
    } catch (error) {
      savedText.textContent = `Error: ${error.message}`;
    }
  });
});
