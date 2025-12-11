# News API Implementation

## Overview
This PR adds a new `/api/news` endpoint to serve tech news articles from the existing `techNewsFeed.ts` module.

## Changes Required

### File: `server/routes.ts`

**Location:** After the `/api/tech/releases` endpoint (around line 1430)

**Code to Insert:**
```typescript
  // Tech News Feed
  app.get("/api/news", async (_req, res) => {
    try {
      const { getTechNews } = await import("./techNewsFeed");
      res.set("Cache-Control", "public, max-age=1800");
      res.json(await getTechNews());
    } catch (error: any) {
      res.status(400).json(formatErrorResponse(error));
    }
  });
```

**Insert After:**
```typescript
  app.get("/api/tech/releases", async (_req, res) => {
    try {
      const { getNewTechReleases } = await import("./techSpotlight");
      res.json(await getNewTechReleases());
    } catch (error: any) {
      res.status(400).json(formatErrorResponse(error));
    }
  });
```

**Insert Before:**
```typescript
  // SWARM PROJECTS - Global Collaboration
  app.post("/api/swarm/create", async (req, res) => {
```

## Features
- Serves 50+ tech news articles across 17 categories
- Includes caching (30 minutes) for better performance
- Uses existing `getTechNews()` function from `techNewsFeed.ts`
- Returns articles with images, descriptions, tags, and metadata

## Testing
After implementation, test with:
```bash
curl http://localhost:5000/api/news
```

Expected response: Array of news articles with fields:
- id
- title
- description
- source
- sourceUrl
- imageUrl
- category
- tags
- createdAt
- likes
- views
