import { OpenRouter } from "@openrouter/sdk";

export const openrouter = new OpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});
