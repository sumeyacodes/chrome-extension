import { useState } from "react";
import { getApiKey } from "./api-key";

// Types for OpenAI API responses
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface CompletionChoice {
  index: number;
  message: {
    role: string;
    content: string;
  };
  finish_reason: string;
}

interface CompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: CompletionChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Make a request to the OpenAI Chat Completions API
 */
export async function getChatCompletion(
  prompt: string,
  systemPrompt: string = "",
  model: string = "gpt-4o"
): Promise<string> {
  try {
    const apiKey = await getApiKey();

    if (!apiKey) {
      throw new Error(
        "No API key found. Please set your OpenAI API key in the extension options."
      );
    }

    const messages: Message[] = [];

    // Add system prompt if provided
    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt,
      });
    }

    // Add user prompt
    messages.push({
      role: "user",
      content: prompt,
    });

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `OpenAI API error: ${errorData.error?.message || response.statusText}`
      );
    }

    const data = (await response.json()) as CompletionResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error in getChatCompletion:", error);
    throw error;
  }
}

/**
 * Enhance a prompt using OpenAI's capabilities
 */
export async function enhancePrompt(originalPrompt: string): Promise<string> {
  const systemInstructions = `You are a prompt engineer who specializes in improving prompts for AI systems.
Analyze the following prompt and enhance it by:
1. Making it more specific with clearer instructions
2. Adding relevant context and constraints
3. Breaking complex requests into clear steps
4. Removing ambiguous language
5. Structuring it for better AI comprehension

Only return the improved prompt without explanations, notes, or meta-commentary.`;

  try {
    return await getChatCompletion(originalPrompt, systemInstructions);
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    throw error;
  }
}

/**
 * React hook for OpenAI API integration
 */
export function useOpenAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Send a prompt to OpenAI and get a completion
   */
  const sendPrompt = async (prompt: string, systemPrompt: string = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getChatCompletion(prompt, systemPrompt);
      setIsLoading(false);
      return response;
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
      return null;
    }
  };

  /**
   * Improve a prompt with AI assistance
   */
  const improvePrompt = async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const enhanced = await enhancePrompt(prompt);
      setIsLoading(false);
      return enhanced;
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
      return null;
    }
  };

  return {
    sendPrompt,
    improvePrompt,
    isLoading,
    error,
  };
}
