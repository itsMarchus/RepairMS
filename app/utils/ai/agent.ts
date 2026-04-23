import { ChatOllama } from "@langchain/ollama";
import { createAgent } from "langchain";

const model = new ChatOllama(
    process.env.OLLAMA_MODEL??'gemma4', 
    {
        baseUrl: process.env.OLLAMA_BASE_URL??'http://127.0.0.1:11434',
        temperature: 0.7,
    }
)

export const agent = createAgent(
    model,
)