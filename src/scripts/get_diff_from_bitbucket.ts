import {writeFile} from 'fs/promises';
import dotenv from 'dotenv';
import assert from 'assert';
import {fetchDiffFromBitbucket} from '../utils/fetchBitbucketDiff.js';

// Load environment variables from .env file
dotenv.config();

// Assert that required environment variables are defined
assert(process.env.BITBUCKET_USERNAME, 'BITBUCKET_USERNAME environment variable is required');
assert(process.env.BITBUCKET_APP_PASSWORD, 'BITBUCKET_APP_PASSWORD environment variable is required');
assert(process.env.PULL_REQUEST_URL, 'PULL_REQUEST_URL environment variable is required');

export const BITBUCKET_DIFF_PATH_NAME = 'temp/pr-diff.txt'

const AUTH_TOKEN = Buffer.from(`${process.env.BITBUCKET_USERNAME}:${process.env.BITBUCKET_APP_PASSWORD}`).toString('base64');

const diff = await fetchDiffFromBitbucket(process.env.PULL_REQUEST_URL, AUTH_TOKEN)

assert(diff, 'Failed to fetch diff from Bitbucket. Please check your credentials and pull request URL.');

await writeFile(BITBUCKET_DIFF_PATH_NAME, diff, {encoding: 'utf8'});
