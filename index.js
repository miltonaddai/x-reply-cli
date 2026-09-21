#!/usr/bin/env node

import { Command } from 'commander';
import dotenv from 'dotenv';
import { TwitterApi } from 'twitter-api-v2';

// Load environment variables
dotenv.config();

// Validate required environment variables
function validateEnv() {
  const required = [
    'X_API_KEY',
    'X_API_KEY_SECRET',
    'X_ACCESS_TOKEN',
    'X_ACCESS_TOKEN_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('Error: Missing required environment variables:');
    missing.forEach(key => console.error(`  - ${key}`));
    console.error('\nPlease copy .env.example to .env and fill in your X API credentials.');
    process.exit(1);
  }
}

// Initialize Twitter API client
function getTwitterClient() {
  validateEnv();

  return new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_KEY_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
  });
}

// Handle API errors
function handleApiError(error) {
  if (error.code === 401) {
    console.error('Error: Authentication failed. Please check your API credentials.');
  } else if (error.code === 403) {
    console.error('Error: Access forbidden. Your app may not have write permissions.');
  } else if (error.code === 429) {
    console.error('Error: Rate limit exceeded. Please try again later.');
  } else if (error.data) {
    console.error('API Error:', error.data);
  } else {
    console.error('Error:', error.message || error);
  }
  process.exit(1);
}

// CLI setup
const program = new Command();

program
  .name('x-reply-cli')
  .description('CLI tool for posting replies on X (Twitter) via X API v2')
  .version('1.0.0');

// Reply command
program
  .command('reply')
  .description('Post a reply to a tweet')
  .argument('<tweetId>', 'ID of the tweet to reply to')
  .argument('<text...>', 'Text of the reply')
  .action(async (tweetId, textArray) => {
    const text = textArray.join(' ');
    
    if (!text.trim()) {
      console.error('Error: Reply text cannot be empty');
      process.exit(1);
    }

    try {
      const client = getTwitterClient();
      const result = await client.v2.tweet({
        text: text,
        reply: {
          in_reply_to_tweet_id: tweetId
        }
      });

      console.log('✓ Reply posted successfully!');
      console.log(`Tweet ID: ${result.data.id}`);
      console.log(`URL: https://twitter.com/i/web/status/${result.data.id}`);
    } catch (error) {
      handleApiError(error);
    }
  });

// Post command (standalone tweet)
program
  .command('post')
  .description('Post a standalone tweet')
  .argument('<text...>', 'Text of the tweet')
  .action(async (textArray) => {
    const text = textArray.join(' ');
    
    if (!text.trim()) {
      console.error('Error: Tweet text cannot be empty');
      process.exit(1);
    }

    try {
      const client = getTwitterClient();
      const result = await client.v2.tweet(text);

      console.log('✓ Tweet posted successfully!');
      console.log(`Tweet ID: ${result.data.id}`);
      console.log(`URL: https://twitter.com/i/web/status/${result.data.id}`);
    } catch (error) {
      handleApiError(error);
    }
  });

// Whoami command
program
  .command('whoami')
  .description('Verify credentials and show authenticated user info')
  .action(async () => {
    try {
      const client = getTwitterClient();
      const user = await client.v2.me();

      console.log('✓ Authentication successful!');
      console.log(`Username: @${user.data.username}`);
      console.log(`Name: ${user.data.name}`);
      console.log(`User ID: ${user.data.id}`);
    } catch (error) {
      handleApiError(error);
    }
  });

program.parse();
