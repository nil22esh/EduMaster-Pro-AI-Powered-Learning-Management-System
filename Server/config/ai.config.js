import openai from "./openai.config.js";
import genAI from "./gemini.config.js";

const PROVIDER = process.env.AI_PROVIDER || "openai";

export const getAIProvider = () => {
  if (PROVIDER === "gemini") {
    return { provider: "gemini", client: genAI };
  }
  return { provider: "openai", client: openai };
};
