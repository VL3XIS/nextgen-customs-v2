---
name: scraping-reddit
description: Scrapes the top posts from a specified Reddit subreddit using the public JSON API. Use when the user wants to gather recent topics, sentiment, or content from a specific community without API keys.
---

# Scraping Reddit

## When to use this skill
- The user asks to see top posts from a subreddit.
- You need to gather recent sentiment or topics from a community (e.g., "What are people saying about X on Reddit?").
- Validating if a subreddit exists.

## Workflow
- [ ] **Identify the Subreddit**: Extract the subreddit name (e.g., "n8n", "localllama").
- [ ] **Execute Scraper**: Run the helper script to fetch the top 3 posts.
- [ ] **Process Output**: Read the standard output for titles and links.

## Instructions
This skill uses a dedicated Python script to access Reddit's public JSON API. It handles User-Agent rotation to avoid 429 errors.

**To scrape a subreddit:**

```bash
python3 .agent/skills/scraping-reddit/scripts/scrape_reddit.py [subreddit_name]
```

**Parameters:**
- `[subreddit_name]`: The name of the subreddit (e.g., `openai`). Defaults to `n8n` if not provided.

**Example Output:**
```text
=== TOP 3 POSTS ===
1. Title of the post
   Score: 1234
   Link: https://...
```

## Resources
- **Script**: `scripts/scrape_reddit.py` (Main logic)
