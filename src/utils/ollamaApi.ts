import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface OllamaGenerateRequest {
    model: string;
    prompt: string;
    stream?: boolean;
    context_length?: number;
}

interface OllamaGenerateResponse {
    response: string;
    // Add other fields if needed based on actual API response
}

/**
 * Generates a response using the Ollama API
 * @param modelName - The name of the Ollama model to use
 * @param prompt - The prompt to send to the model
 * @param contextLength - Optional context length (defaults to 20000 or env var)
 * @returns Promise containing the model's response
 * @throws Error if the API call fails
 */
export async function generateOllamaResponse(
    modelName: string,
    prompt: string,
    contextLength?: number
): Promise<string> {
    const ollamaHost = process.env.OLLAMA_HOST || 'localhost';
    const apiUrl = `http://${ollamaHost}:11434/api/generate`;

    const requestBody: OllamaGenerateRequest = {
        model: modelName,
        prompt,
        stream: false,
        context_length: contextLength || Number(process.env.CONTEXT_LENGTH) || 20000,
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as OllamaGenerateResponse;
        return data.response;
    } catch (error) {
        throw new Error(`Failed to generate Ollama response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
} 