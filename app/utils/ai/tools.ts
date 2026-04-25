import { tool } from "langchain";
import { z } from "zod";
import { tavily } from "@tavily/core";

const tavilyClient = tavily({
    apiKey: process.env.TAVILY_API_KEY!,
})
// const youtubeAPIKEY =

export const webSearchTool = tool(
    async ({ query }) => {
        return await tavilyClient.search(query);
    },
    {
        name: "webSearchTool",
        description: "Search the web for information",
        schema: z.object({
            query: z.string(),
        }),
    }
)

interface YoutubeSearchItem {
    id?: { videoId?: string };
    snippet?: { title?: string };
}

interface YoutubeSearchResponse {
    items?: YoutubeSearchItem[];
    error?: { message?: string };
}

export const youtubeSearchTool = tool(
    async ({ query }) => {
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            return "YouTube search is unavailable: YOUTUBE_API_KEY is not configured.";
        }

        const url = new URL("https://www.googleapis.com/youtube/v3/search");
        url.search = new URLSearchParams({
            part: "snippet",
            q: query,
            key: apiKey,
            maxResults: "3",
            type: "video",
        }).toString();

        const res = await fetch(url);
        const data = (await res.json()) as YoutubeSearchResponse;

        if (!res.ok) {
            return `YouTube search failed (${res.status}): ${data.error?.message ?? "unknown error"}.`;
        }

        const items = data.items ?? [];
        if (items.length === 0) {
            return `No YouTube results found for "${query}".`;
        }

        const results = items
            .map((item) => {
                const title = item.snippet?.title;
                const videoId = item.id?.videoId;
                if (!title || !videoId) return null;
                return `${title}\nhttps://www.youtube.com/watch?v=${videoId}`;
            })
            .filter((line): line is string => line !== null);

        return results.length > 0
            ? results.join("\n\n")
            : `No usable YouTube results found for "${query}".`;
    },
    {
        name: "youtubeSearchTool",
        description:  `
        Search youtube for videos related to the query.
        
        Return 1-5 videos in Markdown format:
        - [Title](https://youtube.com/...)
        
        No raw URLs. No extra text.
        `,
        schema: z.object({
            query: z.string(),
        }),
    }
)

