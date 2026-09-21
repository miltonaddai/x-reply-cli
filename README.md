# X Reply CLI

A simple Node.js command-line tool for posting replies on X (Twitter) using the X API v2.

## What is this?

This CLI allows you to post replies to tweets programmatically using your X developer credentials. It's designed for intentional, one-off replies from an authenticated X account (e.g., @jointribefun).

**⚠️ Important:** Automated promotional reply spam can violate X's Terms of Service and risk account suspension. This tool is intended for approved, manual use only—not for automated bot behavior.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- An X (Twitter) developer account with:
  - API Key and API Key Secret
  - Access Token and Access Token Secret (with **Read and Write** permissions)

## Getting X API Credentials

1. Go to the [X Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app (or use an existing one)
3. Navigate to your app's "Keys and tokens" section
4. Generate/regenerate:
   - **API Key and Secret** (also called Consumer Key/Secret)
   - **Access Token and Secret** with **Read and Write** permissions
5. Save these credentials securely—you'll need them for the `.env` file

**Important:** Make sure your app has **User authentication settings** configured with OAuth 1.0a enabled and **Read and Write** permissions. Without write permissions, you won't be able to post tweets.

## Setup

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd x-reply-cli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your X API credentials:
   ```
   X_API_KEY=your_api_key_here
   X_API_KEY_SECRET=your_api_key_secret_here
   X_ACCESS_TOKEN=your_access_token_here
   X_ACCESS_TOKEN_SECRET=your_access_token_secret_here
   ```

## Usage

### Verify Your Credentials

Check that your API credentials are working:

```bash
npm run whoami
```

Or using npx:

```bash
npx . whoami
```

### Reply to a Tweet

Post a reply to an existing tweet:

```bash
npm run reply -- 1234567890123456789 "This is my reply text"
```

Or using npx:

```bash
npx . reply 1234567890123456789 "This is my reply text"
```

**Finding Tweet IDs:** The tweet ID is the long number in the tweet URL. For example, in `https://twitter.com/user/status/1234567890123456789`, the ID is `1234567890123456789`.

### Post a Standalone Tweet

Post a tweet without replying to anyone:

```bash
npm run post -- "Hello from the CLI!"
```

Or using npx:

```bash
npx . post "Hello from the CLI!"
```

### Help

View all available commands:

```bash
npx . --help
```

## Error Handling

The CLI provides clear error messages for common issues:

- **Missing credentials:** You'll be prompted to check your `.env` file
- **Authentication failed (401):** Invalid API credentials
- **Access forbidden (403):** App may lack write permissions
- **Rate limit exceeded (429):** Too many requests; wait before trying again

## Project Structure

```
x-reply-cli/
├── index.js           # Main CLI application
├── package.json       # Project dependencies and scripts
├── .env.example       # Template for environment variables
├── .gitignore        # Git ignore rules (includes .env)
└── README.md         # This file
```

## Security Notes

- **Never commit your `.env` file** to version control
- Store your API credentials securely
- Rotate your access tokens if they're ever exposed
- Use this tool responsibly and in compliance with X's Terms of Service

## License

MIT
