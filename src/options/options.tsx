import { Button } from "../components/button";
import { useApiKey } from "../hooks/api-key";

export default function Options() {
  const { apiKey, setApiKey, saveApiKey, status, isLoading } = useApiKey();

  return (
    <main className="w-full max-w-lg mx-auto space-y-6 p-6">
      <h1 className="text-2xl font-bold">OpenAI API Key</h1>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Add your own API key, this will be stored securely in your browser's
          storage.
        </p>

        <div className="space-y-2">
          {isLoading ? (
            <p>Loading API key...</p>
          ) : (
            <>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="border border-gray-300 p-2 rounded-md w-full"
              />

              <Button onClick={saveApiKey} disabled={!apiKey.trim()}>
                Save API Key
              </Button>

              {status && <p className="text-green-600 font-medium">{status}</p>}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
