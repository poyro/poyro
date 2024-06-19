"use client";
import { useChat } from "ai/react";
import { log } from "@repo/logger";

const Page = (): JSX.Element => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  log("Hey! This is the Home page.");

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div
          className="whitespace-pre-wrap"
          data-testid={m.role === "user" ? "user-message" : "assistant-message"}
          key={m.id}
        >
          {m.role === "user" ? "User: " : "Assistant: "}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          data-testid="chat-input"
          onChange={handleInputChange}
          placeholder="What ingredients do you have in your kitchen?"
          value={input}
        />
      </form>
    </div>
  );
};

export default Page;
