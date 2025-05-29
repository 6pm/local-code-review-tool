/**
 * Utility functions for parsing Bitbucket URLs
 */

/**
 * Parses a Bitbucket pull request URL into its component parts
 * @param url The Bitbucket pull request URL to parse
 * @returns An object containing the workspace, repository slug, and pull request ID, or null if parsing fails
 */
export function parseBitbucketPullRequestUrl(url: string): PRInfo | null {
    try {
        const parsedUrl = new URL(url);
        const parts = parsedUrl.pathname.split('/').filter(Boolean);

        // Expected structure:
        // ['workspace-or-team', 'repo', 'pull-requests', 'id', 'diff']
        if (parts.length < 5 || parts[2] !== 'pull-requests') {
            console.error('Invalid Bitbucket pull request URL format.');
            return null;
        }

        const [workspace, repoSlug, , pullRequestId] = parts;

        return {
            workspace,
            repoSlug,
            pullRequestId,
        };
    } catch (error) {
        console.error('Failed to parse URL:', error);
        return null;
    }
}

/**
 * Type definition for Bitbucket pull request information
 */
export type PRInfo = {
    workspace: string;
    repoSlug: string;
    pullRequestId: string;
};