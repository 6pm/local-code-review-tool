/**
 * This script performs code review on PR diffs using multiple Ollama models.
 * It reads a diff file, splits it by changed files, and generates reviews for each file
 * using available Ollama models.
 */

import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { splitDiffByFiles } from '../utils/splitDiffByFiles';
import dotenv from 'dotenv';
import { generatePrompt } from '../prompts/generatePrompt';
import { getAvailableModels } from '../utils/modelUtils';
import { generateOllamaResponse } from '../utils/ollamaApi';

// Load environment variables
dotenv.config();

// Constants
const INPUT_FILE = 'temp/pr-diff.txt';
const OUTPUT_FILE_PREFIX = 'temp/review';

/**
 * Main execution function that orchestrates the review process
 */
async function main() {
    try {
        // Get available models and read diff content
        const models = await getAvailableModels();
        const diffContent = await readFile(INPUT_FILE, 'utf8');
        
        console.log(`✅ Using models: ${models.join(', ')}`);
        
        // Split diff by files and process with each model
        const fileDiffs = splitDiffByFiles(diffContent);
        for (const model of models) {
            await reviewWithModel(model, fileDiffs);
        }
    } catch (error) {
        console.error('Review process failed:', error);
        process.exit(1);
    }
}

// Start the review process
main();


/**
 * Reviews a set of file diffs using a specific model and saves the results
 * @param modelName - Name of the Ollama model to use
 * @param fileDiffs - Map of filenames to their diffs
 */
async function reviewWithModel(modelName: string, fileDiffs: Map<string, string>) {
    const outputFile = `${OUTPUT_FILE_PREFIX}-${modelName}.txt`;
    
    // Initialize empty output file
    await writeFile(outputFile, '', 'utf8');

    // Process each file diff
    for (const [filename, diff] of fileDiffs) {
        console.log(`\n🗂️ Reviewing ${filename} with ${modelName}`);
        
        try {
            // Generate and get review
            const review = await generateOllamaResponse(
                modelName, 
                await generatePrompt(diff)
            );
            
            // Format and save review
            const reviewSection = [
                `\n\n=== File: ${filename} ===\n`,
                review,
                '\n' + '='.repeat(50) + '\n'
            ].join('\n');
            
            await appendFile(outputFile, reviewSection, 'utf8');
        } catch (error) {
            console.error(`Failed to review ${filename}:`, error);
            // Continue with next file
        }
    }

    console.log(`\n✅ ${modelName} reviews saved to ${outputFile}`);
}


