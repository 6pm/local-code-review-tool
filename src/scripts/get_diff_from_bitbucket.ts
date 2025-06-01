/**
 * Script to fetch and save a pull request diff from Bitbucket.
 * This script is part of a code review tool that automates the process of
 * retrieving pull request diffs for review.
 */

import {writeFile, mkdir} from 'fs/promises';
import {dirname} from 'path';
import dotenv from 'dotenv';
import assert from 'assert';
import {fetchDiffFromBitbucket} from '../utils/fetchBitbucketDiff.js';

// Load environment variables from .env file
dotenv.config();

// Configuration object to centralize all constants and paths
const CONFIG = {
  // Path where the diff will be saved
  BITBUCKET_DIFF_PATH: 'temp/pr-diff.txt',
  // Required environment variables with their error messages
  REQUIRED_ENV_VARS: {
    BITBUCKET_USERNAME: 'BITBUCKET_USERNAME environment variable is required',
    BITBUCKET_APP_PASSWORD: 'BITBUCKET_APP_PASSWORD environment variable is required',
    PULL_REQUEST_URL: 'PULL_REQUEST_URL environment variable is required',
  },
} as const;

// Validate that all required environment variables are present
Object.entries(CONFIG.REQUIRED_ENV_VARS).forEach(([key, message]) => {
  assert(process.env[key], message);
});

// Create Base64 encoded authentication token for Bitbucket API
const AUTH_TOKEN = Buffer.from(`${process.env.BITBUCKET_USERNAME}:${process.env.BITBUCKET_APP_PASSWORD}`).toString('base64');

try {
  // Get and validate the pull request URL
  const PULL_REQUEST_URL = process.env.PULL_REQUEST_URL;

  if (!PULL_REQUEST_URL) {
    throw new Error('PULL_REQUEST_URL is not defined');
  }
  
  // Fetch the diff from Bitbucket
  const diff = await fetchDiffFromBitbucket(PULL_REQUEST_URL, AUTH_TOKEN);
  
  // Validate that we received a diff
  if (!diff) {
    throw new Error('Failed to fetch diff from Bitbucket. Please check your credentials and pull request URL.');
  }

  // Create the output directory if it doesn't exist
  await mkdir(dirname(CONFIG.BITBUCKET_DIFF_PATH), { recursive: true });
  
  // Save the diff to a file
  await writeFile(CONFIG.BITBUCKET_DIFF_PATH, diff, { encoding: 'utf8' });
  console.log(`Successfully saved diff to ${CONFIG.BITBUCKET_DIFF_PATH}`);
} catch (error) {
  // Handle any errors that occur during the process
  console.error('Error:', error instanceof Error ? error.message : 'An unknown error occurred');
  process.exit(1);
}
