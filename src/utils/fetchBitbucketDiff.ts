/**
 * Utility functions for fetching diffs from Bitbucket
 */

import {parseBitbucketPullRequestUrl} from './parseBitbucketUrl.js';

/**
 * Fetches the diff for a Bitbucket pull request
 * @param prUrl The URL of the Bitbucket pull request
 * @param authToken The Base64-encoded authentication token (username:app_password)
 * @returns The diff as a string, or null if fetching fails
 */
export async function fetchDiffFromBitbucket(prUrl: string, authToken: string): Promise<string | null> {
    const prInfo = parseBitbucketPullRequestUrl(prUrl);
    if (!prInfo) {
        console.error('Could not parse PR URL.');
        return null;
    }

    const { workspace, repoSlug, pullRequestId } = prInfo;
    const apiUrl = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/pullrequests/${pullRequestId}/diff`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Basic ${authToken}`
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch diff: ${response.status} ${response.statusText}`);
            return null;
        }

        const diff = await response.text();
        return diff;
    } catch (error) {
        console.error('Error fetching diff:', error);
        return null;
    }
}