import { useState, useEffect } from "react";
import { Button } from "../components/button";
import {
  fetchInputText,
  getSavedText,
  setSavedText as storageSetSavedText,
  clearSavedText,
} from "../utils/chromeUtils";
import { enhancePrompt } from "../hooks/open-ai";

export default function Popup() {
  const [savedText, setSavedTextState] = useState<string>("Loading...");
  const [isEnhancing, setIsEnhancing] = useState(false);

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

  const handleEnhancePrompt = async () => {
    try {
      // Check if there's text to enhance
      if (
        !savedText ||
        savedText === "No text stored" ||
        savedText === "Loading..."
      ) {
        setSavedTextState("No text to enhance. Fetch some text first!");
        return;
      }

      setIsEnhancing(true);
      setSavedTextState("Enhancing prompt...");

      const enhanced = await enhancePrompt(savedText);
      setSavedTextState(enhanced);
      storageSetSavedText(enhanced);
    } catch (error: any) {
      setSavedTextState(`Error enhancing prompt: ${error.message}`);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <main className="w-full">
      <h1 className="text-xl font-semibold">Lazy Prompt Engineer</h1>

      <section className="text-lg my-4 p-4 border border-gray-300 rounded-md min-h-[150px] max-h-[300px] w-full overflow-y-auto">
        {savedText}
      </section>

      <section className="gap-2 w-full flex flex-col">
        <Button onClick={handleFetchText} disabled={isEnhancing}>
          Fetch Text
        </Button>
        <Button
          onClick={handleEnhancePrompt}
          disabled={
            isEnhancing ||
            savedText === "No text stored" ||
            savedText === "Loading..."
          }
        >
          Enhance Prompt
        </Button>
        <Button onClick={handleClearText} disabled={isEnhancing}>
          Clear Storage
        </Button>
      </section>
    </main>
  );
}
