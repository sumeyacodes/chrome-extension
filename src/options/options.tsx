import { useState, useEffect } from "react";
import { Button } from "../components/button";

export default function Options() {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("");

  // Load API key on component mount
  useEffect(() => {
    chrome.storage.sync.get(["openaiApiKey"], (result) => {
      if (result.openaiApiKey) {
        setApiKey(result.openaiApiKey);
      }
    });
  }, []);

  const saveApiKey = () => {
    // Save API key to Chrome storage
    chrome.storage.sync.set({ openaiApiKey: apiKey }, () => {
      setStatus("API key saved!");

      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatus("");
      }, 3000);
    });
  };

  return (
    <main className="w-full max-w-lg mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-bold">OpenAI API Key</h1>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Add your own API key, this will be stored in your browser's local
          storage.
        </p>

        <div className="space-y-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="border border-gray-300 p-2 rounded-md w-full"
          />

          <Button onClick={saveApiKey}>Save API Key</Button>

          {status && <p className="text-green-600 font-medium">{status}</p>}
        </div>
      </div>
    </main>
  );
}
