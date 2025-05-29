import { encoding_for_model } from 'tiktoken';
import {readFile} from "node:fs/promises";

/**
 * Counts tokens in the provided text
 * @param text - The text to count tokens in
 * 
 * @returns Number of tokens
 */
export function countTokensInText(text: string): number {
    const encoder = encoding_for_model('gpt-3.5-turbo');
    const tokens = encoder.encode(text);
    return Math.round(tokens.length * 1.1);
}

/**
 * Підраховує кількість токенів у тексті
 * @param filePath - адреса до файлу
 *
 * @returns Кількість токенів
 */
export async function countTokensInFilePath(filePath: string): Promise<number> {
    const text = await readFile(filePath, 'utf-8');
    return countTokensInText(text);
}