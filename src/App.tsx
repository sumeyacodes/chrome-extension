import { useState, useEffect } from "react";
import "./App.css";
import { Button } from "./components/button";
import {
  fetchInputText,
  getSavedText,
  setSavedText as storageSetSavedText,
  clearSavedText,
} from "./utils/chromeUtils";

function App() {
  const [savedText, setSavedTextState] = useState<string>("Loading...");

  useEffect(() => {
    getSavedText().then((saved) => setSavedTextState(saved));
  }, []);

  const handleClearText = async () => {
    await clearSavedText();
    setSavedTextState("Text cleared!");
    setTimeout(() => {
      setSavedTextState("No text stored");
    }, 2000);
  };

  const handleFetchText = async () => {
    try {
      const response = await fetchInputText();

      if (response?.error) {
        setSavedTextState(response.error);
      } else if (response?.text) {
        const formatted = response.text;
        setSavedTextState(formatted);
        storageSetSavedText(formatted);
      } else {
        setSavedTextState("No text found in the current input field");
      }
    } catch (error: any) {
      setSavedTextState(`Error: ${error.message}`);
    }
  };

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold">Hello Prompt!</h1>

      <section className="text-lg my-4 p-4 border border-gray-300 min-h-[150px] max-h-[300px]">
        {savedText}
      </section>

      <section className="gap-2 flex flex-col">
        <Button onClick={handleFetchText}>Fetch Text</Button>
        <Button onClick={handleClearText}>Clear Storage</Button>
      </section>
    </main>
  );
}

export default App;
