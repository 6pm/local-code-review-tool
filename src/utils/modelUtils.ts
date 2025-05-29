/**
 * Utility module for handling Ollama model operations and availability checks.
 * This module provides functionality to check model availability and retrieve available models
 * from the Ollama server.
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Default model to use if none is specified
const defaultModel = 'qwen2.5-coder:7b';

/**
 * Checks if a specific Ollama model is available on the server.
 * Makes a request to the Ollama API to verify if the model exists and is ready to use.
 * 
 * @param modelName - The name of the model to check
 * @returns Promise<boolean> - True if the model is available, false otherwise
 */
export async function checkModelAvailability(modelName: string): Promise<boolean> {
    try {
        // Get Ollama host from environment variables or default to localhost
        const ollamaHost = process.env.OLLAMA_HOST || 'localhost';
        const response = await fetch(`http://${ollamaHost}:11434/api/show`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: modelName }),
        });

        if (!response.ok) {
            console.error(`❌ Model ${modelName} is not available`);
            return false;
        }

        const data = await response.json();
        // Check if the model exists by verifying the modelfile property
        return !!data.modelfile;
    } catch (error) {
        console.error(`❌ Error checking model ${modelName}:`, error);
        return false;
    }
}

/**
 * Retrieves a list of available Ollama models based on the provided configuration.
 * Models can be specified through environment variables or passed directly as a parameter.
 * Multiple models can be specified using a comma-separated string.
 * 
 * @param modelEnvValue - Optional comma-separated string of model names to check
 * @returns Promise<string[]> - Array of available model names
 * @throws Error if no models are available
 */
export async function getAvailableModels(modelEnvValue?: string): Promise<string[]> {
    // Parse model names from environment variables or parameter
    const modelNames = (modelEnvValue || process.env.MODEL_NAME || defaultModel)
        .split(',')
        .map(model => model.trim())
        .filter(Boolean);

    const availableModels: string[] = [];
    
    // Check availability for each specified model
    for (const modelName of modelNames) {
        const isAvailable = await checkModelAvailability(modelName);
        if (isAvailable) {
            availableModels.push(modelName);
        } else {
            console.warn(`⚠️ Model ${modelName} is not available and will be skipped`);
        }
    }

    // Throw error if no models are available
    if (availableModels.length === 0) {
        throw new Error('No models are available. Please pull at least one model using: ollama pull <model_name>');
    }

    return availableModels;
} 