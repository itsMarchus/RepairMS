import { ChatOllama } from "@langchain/ollama";
import { createAgent } from "langchain";
import { webSearchTool, youtubeSearchTool } from "@/app/utils/ai/tools";

const model = new ChatOllama({
    model: process.env.OLLAMA_MODEL ?? "gemma3",
    baseUrl: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
    temperature: 0.4,
});

export const agent = createAgent({
    model,
    tools: [webSearchTool, youtubeSearchTool],
});
