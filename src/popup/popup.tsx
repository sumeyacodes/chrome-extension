import { useState, useEffect } from "react";
import { Button } from "../components/button";
import {
  getSavedText,
  setSavedText as storageSetSavedText,
  clearSavedText,
  setupRealTimeListener, // Add this import
} from "../utils/chromeUtils";
// import Options from "./options/options";

export default function Popup() {
  const [savedText, setSavedTextState] = useState<string>("Loading...");

  useEffect(() => {
    // Initialize with saved text
    getSavedText().then((saved) => setSavedTextState(saved));

    // Setup real-time listener
    const cleanup = setupRealTimeListener((text) => {
      const formattedText = text || "No text detected";
      setSavedTextState(formattedText);
      storageSetSavedText(formattedText);
    });

    // Cleanup on unmount
    return cleanup;
  }, []);

  const handleClearText = async () => {
    await clearSavedText();
    setSavedTextState("Text cleared!");
    setTimeout(() => {
      setSavedTextState("No text stored");
    }, 2000);
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold">Hello Prompt!</h1>

      <section className="text-lg my-4 p-4 border border-gray-300 min-h-[150px] max-h-[300px]">
        {savedText}
      </section>

      <section className="gap-2 flex flex-col">
        <Button onClick={handleClearText}>Clear Storage</Button>
      </section>
    </main>
  );
}
