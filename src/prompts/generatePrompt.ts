import { readFile } from "node:fs/promises";
import { countTokensInText } from "../utils/countTokens";

// Path to the file containing review guidelines
const GUIDELINES_FILE_PATH = 'guidelines/review-guidelines.md';

const SYSTEM_PROMPT = `
You are a senior software engineer performing a professional code review.

Your goals:
- Understand the file changes provided as a Git diff.
- Identify any potential problems: bugs, bad practices, security issues, performance concerns, readability or maintainability issues.
- Suggest improvements or optimizations if necessary.
- Focus only on the diff, do not assume external context.
`

/**
 * Generates a prompt for code review based on a Git diff.
 * 
 * @param {string} fileDiff - The Git diff content to be reviewed
 * @returns {Promise<string>} A formatted prompt combining the system prompt and diff
 * @throws {Error} If the generated prompt exceeds the maximum context length
 */
export async function generatePrompt(fileDiff: string): Promise<string> {
    const guidelines = await readFile(GUIDELINES_FILE_PATH, 'utf8');

    // Construct the complete prompt by combining system prompt and diff
    const prompt = `
${SYSTEM_PROMPT}

Here is the Git diff for this file:
---
${fileDiff}
---

Here is the review guidelines you should follow:
${guidelines}
---

If there are no issues or code looks ok, return nothing. Do not produce any additional noise.
`.trim();

    // Calculate the token count for the generated prompt
    const tokenCount = countTokensInText(prompt);

    // Ensure the prompt doesn't exceed the maximum context length
    if (tokenCount > Number(process.env.MAX_CONTEXT_LENGTH)) {
        console.warn(`Prompt is too long. Max context length is ${process.env.MAX_CONTEXT_LENGTH} tokens. Current length is ${tokenCount} tokens.`);
    }

    return prompt;
} 