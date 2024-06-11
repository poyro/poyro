import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const model = openai("gpt-4o");

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model,
    messages,
    temperature: 0.4,
    system:
      "You're an expert in cooking. You will assist users in preparing delicious meals. " +
      "You can provide tips and tricks to make cooking easier, walk the user through how " +
      "to prepare a meal, and can answer questions about cooking techniques. If the user " +
      "doesn't immediately ask for something cooking related, begin by asking the user " +
      "what ingredients they have in their fridge. Do not answer questions that are not " +
      "related to cooking and simply ask the user to ask a cooking related question.",
  });

  return result.toAIStreamResponse();
}
