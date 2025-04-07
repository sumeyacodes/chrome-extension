import { useState, useEffect } from "react";

export interface ApiKeyHookResult {
  apiKey: string;
  setApiKey: (key: string) => void;
  saveApiKey: () => Promise<void>;
  status: string;
  isLoading: boolean;
}

/**
 * Custom hook to manage the OpenAI API key in Chrome storage
 * @returns {ApiKeyHookResult} API key management functions and state
 */
export function useApiKey(): ApiKeyHookResult {
  const [apiKey, setApiKeyState] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load API key on mount
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        setIsLoading(true);
        chrome.storage.sync.get(["openaiApiKey"], (result) => {
          if (result.openaiApiKey) {
            setApiKeyState(result.openaiApiKey);
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error loading API key:", error);
        setIsLoading(false);
      }
    };

    loadApiKey();
  }, []);

  // Update API key state
  const setApiKey = (key: string) => {
    setApiKeyState(key);
    setStatus("");
  };

  // Save API key to Chrome storage
  const saveApiKey = async (): Promise<void> => {
    return new Promise((resolve) => {
      try {
        setStatus("Saving API key...");
        chrome.storage.sync.set({ openaiApiKey: apiKey }, () => {
          setStatus("API key saved successfully!");

          // Clear success message after 3 seconds
          setTimeout(() => {
            setStatus("");
          }, 3000);

          resolve();
        });
      } catch (error) {
        console.error("Error saving API key:", error);
        setStatus("Failed to save API key. Please try again.");
        setTimeout(() => {
          setStatus("");
        }, 3000);
        resolve();
      }
    });
  };

  return { apiKey, setApiKey, saveApiKey, status, isLoading };
}

/**
 * Get the API key from Chrome storage (for use outside React components)
 * @returns {Promise<string>} The stored API key or empty string
 */
export async function getApiKey(): Promise<string> {
  return new Promise((resolve) => {
    try {
      chrome.storage.sync.get(["openaiApiKey"], (result) => {
        resolve(result.openaiApiKey || "");
      });
    } catch (error) {
      console.error("Error getting API key:", error);
      resolve("");
    }
  });
}
