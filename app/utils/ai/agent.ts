import { ChatOllama } from "@langchain/ollama";
import { createAgent } from "langchain";
import { webSearchTool, youtubeSearchTool } from "@/app/utils/ai/tools";

const model = new ChatOllama({
    model: process.env.OLLAMA_MODEL ?? "gemma3",
    baseUrl: process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434",
    temperature: 0.4,
});

const systemPrompt = `
You are an expert AI diagnostic assistant for a device repair shop.
You help technicians diagnose devices, suggest troubleshooting steps, recommend parts, and draft concise technician notes.
Be practical, step-by-step, and safety-aware. Prefer numbered steps and short paragraphs.
You should use the web_search or youtube_search tools, to get the latest information about the device and the issue.
Cite the source URLs you actually used.
`;

export const agent = createAgent({
    model,
    tools: [webSearchTool, youtubeSearchTool],
    systemPrompt,

});
