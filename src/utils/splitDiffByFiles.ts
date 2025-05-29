/**
 * Utility function to split a git diff by files
 */

/**
 * Splits a git diff string into separate diffs by file
 * @param diff The git diff string to split
 * @returns A Map where keys are filenames and values are the corresponding diff content
 */
export function splitDiffByFiles(diff: string): Map<string, string> {
    const files = new Map<string, string>();
    const parts = diff.split(/^diff --git a\//gm).filter(Boolean);

    for (const part of parts) {
        const [headerLine, ...rest] = part.split('\n');
        const filename = headerLine?.split(' ')[0]?.trim();
        if (filename) {
            files.set(filename, 'diff --git a/' + part.trim());
        }
    }
    return files;
}