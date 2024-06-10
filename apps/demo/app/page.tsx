"use client";
import { useChat } from "ai/react";
import clsx from "clsx";

import { log } from "@repo/logger";
// import { CounterButton, Link } from "@repo/ui";

const Page = (): JSX.Element => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  log("Hey! This is the Home page.");

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div
          key={m.id}
          className="whitespace-pre-wrap"
          data-testid={m.role === "user" ? "user-message" : "assistant-message"}
        >
          {m.role === "user" ? "User: " : "Assistant: "}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          data-testid="chat-input"
          value={input}
          placeholder="What ingredients do you have in your kitchen?"
          onChange={handleInputChange}
        />
      </form>
    </div>
  );

  // return (
  //   <div className="container">
  //     <h1 className="title">
  //       Store <br />
  //       <span>Kitchen Sink</span>
  //     </h1>
  //     <CounterButton />
  //     <p className="description">
  //       Built With{" "}
  //       <Link href="https://turbo.build/repo" newTab>
  //         Turborepo
  //       </Link>
  //       {" & "}
  //       <Link href="https://nextjs.org/" newTab>
  //         Next.js
  //       </Link>
  //     </p>
  //   </div>
  // );
};

export default Page;
