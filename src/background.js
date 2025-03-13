// fingers crossed this is ok :D

// event listener for incoming messages to the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // checks if the received message has an "action" field with the value "fetchInputText"
  // this filters so we only handle messages we're interested in
  if (request.action === "fetchInputText") {
    // query for the active tab in the current window
    // this is needed to send a message to the content script
    // only the allowed urls in manfiest.json can be queried
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        sendResponse({ error: "No active tab found" });
        return;
      }

      // simply forward the message to the content script that's already loaded
      chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
        if (chrome.runtime.lastError) {
          // this happens if we're not on a matched URL (content script not loaded)
          sendResponse({
            error:
              "Not on a supported website. Extension only works on selected sites.",
          });
        } else {
          sendResponse(response);
        }
      });
    });

    return true; // keep channel open for async response
  }
});
