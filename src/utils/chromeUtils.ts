export interface FetchResponse {
  error?: string;
  text?: string;
}

// Wrap chrome.runtime.sendMessage in a Promise for fetching input text.
export const fetchInputText = async (): Promise<FetchResponse> => {
  return new Promise<FetchResponse>((resolve) => {
    chrome.runtime.sendMessage(
      { action: "fetchInputText" },
      (response: FetchResponse) => {
        resolve(response);
      }
    );
  });
};

// Wrap getting saved text from chrome.storage.local.
export const getSavedText = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(["savedText"], (result) => {
      resolve(result.savedText || "No text stored");
    });
  });
};

// Set saved text in chrome.storage.local.
export const setSavedText = (text: string): void => {
  chrome.storage.local.set({ savedText: text });
};

// Clear saved text from chrome.storage.local.
export const clearSavedText = async (): Promise<void> => {
  return new Promise((resolve) => {
    chrome.storage.local.remove("savedText", () => {
      resolve();
    });
  });
};
// Add real-time listener support
export const setupRealTimeListener = (callback: (text: string) => void) => {
  const handler = (message: any) => {
    if (message.action === "textUpdate") {
      callback(message.text);
    }
  };
  chrome.runtime.onMessage.addListener(handler);

  // Return cleanup function
  return () => chrome.runtime.onMessage.removeListener(handler);
};
