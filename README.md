# youtube-live-parser


## Problem Statement
The goal was to fetch live or recently completed video streams for specific YouTube channels. For most channels, the latest live video suffices. However, for some channels that stream multiple videos simultaneously, we need to filter streams by specific title segments to ensure we retrieve the most relevant stream. The goal is to build a system that:

1. Fetches the latest live or completed video stream for channels.
2. Handles title-based prioritization for specific channels.
3. Provides a fallback mechanism for channels without title-based prioritization.

## Solution Overview
To address the problem, i designed a flexible system that uses the YouTube Data API to:

1. Fetch live and completed videos for multiple channels.
2. Prioritize videos matching specific title segments using regex.
3. Fallback to the latest live or completed video when title matching is not required or fails.
4. Handle multiple channels in parallel for efficiency.

The solution is implemented with a JSON-based configuration file that defines channel-specific behavior and a robust JavaScript function to process the data.

---

## The YouTube Data API
The YouTube Data API is a powerful tool for interacting with YouTube content programmatically. In this project, we use the `search` endpoint to fetch videos by channel and filter them by event type (live or completed).

### Endpoint Details

**Base URL:**
```
https://www.googleapis.com/youtube/v3/search
```

**Parameters Used:**
- `key`: API key for authentication.
- `channelId`: The ID of the channel to fetch videos from.
- `type`: Specifies the resource type (set to `video`).
- `eventType`: Filters by video event type (`live` or `completed`).
- `maxResults`: Number of results to return (default is 1, but increased to 5 when filtering by title).
- `part`: Specifies the resource parts to retrieve (set to `snippet` for metadata like title and description).
- `order`: Specifies sorting order (set to `date` to retrieve the latest videos).

**Response Structure:**

The response includes an array of video items, each with a `snippet` containing metadata including:
- `title`: The video title.
- `description`: The video description.
- `publishedAt`: The video publication date.

---

## JSON Configuration
The behavior for each channel is defined in a JSON configuration:

```json
[
  {
    "channelId": "UCT1egsvA08YcdMLiEu1DTRg",
    "title": "specific title segment"
  },
  {
    "channelId": "UCxJ...", 
    "title": null
  }
]
```

### Explanation
- `channelId`: The ID of the YouTube channel.
- `title`: The title segment to match. If `null`, the latest live or completed video is fetched without filtering.

---

## Edge Cases
1. **Multiple Streams with the Same Title:**
   - The system fetches up to 5 results and uses regex to match the desired title segment.
2. **No Matching Title:**
   - Falls back to fetching the latest live or completed video.
3. **No Live Streams Available:**
   - Searches completed streams if no live streams are found.
4. **Invalid Channel ID or API Key:**
   - Logs an error and skips processing for that channel.

---
