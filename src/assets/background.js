chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchInputText") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.id) {
        sendResponse({ error: "No active tab found" });
        return;
      }

      chrome.tabs.sendMessage(
        activeTab.id,
        { action: "fetchInputText" },
        (response) => {
          if (chrome.runtime.lastError) {
            sendResponse({
              error: "Extension not supported on this site.",
            });
          } else {
            sendResponse(response);
          }
        }
      );
    });
    return true; // Indicate async response
  }
});
