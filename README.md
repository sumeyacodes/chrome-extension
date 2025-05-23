# Lazy Prompt Engineering

A Chrome extension I'm building to (hopefully) make **_good_** prompt engineering a bit less tedious, and more efficient - inspired by the prompt enhancer buttons in Bolt and V0.

Sometimes, writing a solid prompt requires detailed instructions that I don't want to type out completely. This often results in unproductive and frustrating conversations because the LLM misinterprets my poorly worded, vague, and often incomplete instructions.

The extension should also allow me to dynamically add which websites the extension can access.

## General plans

(subject to change as I figure things out along the way)

1. Read text from input fields
   - Get the extension to grab whatever text I've typed into different input fields automatically.
2. Restrict access to ony selected websites
   - Figure out how to make the extension only work on certain websites dynamically so users can add their own sites to the list.
3. AI Integration
   - Find some way to allow AI to enhance these prompts, not in a one size fixes all way but in a way that allows users to tailor the type of prompt they want.
   - Possibly have it give suggestions, or have it learn your prompt style? Need to think about how I'd want to use it myself.
4. UI & extension popup
   - Should probably use React for this.
