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

export const youtubeSearchTool = tool(
    async ({ query}) => {
        const url = "https://www.googleapis.com/youtube/v3/search"
        const params = {
            "part": "snippet",
            "q": query,
            "key": process.env.YOUTUBE_API_KEY!,
            "maxResults": 3,
            "type": "video",
        }
        const res = await fetch(`${url}?${params}`)
        const data = await res.json()
        let results: string[] = []

        for (const item of data.items) {
            const title = item.snippet.title
            const video_id = item.id.videoId
            const link = `https://www.youtube.com/watch?v=${video_id}`
            results.push(`${title} \n ${link}`)
        }
        return results.join("\n")
    },
    {
        name: "youtubeSearchTool",
        description: "Search the youtube for information",
        schema: z.object({
            query: z.string(),
        }),
    }
)

