import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { POST } from "./route";

const baseUrl = "http://localhost:3000";

const destreamify = (str: string) => {
  return str.replaceAll('0:"', "").replaceAll('"\n', "");
};

describe("POST /api/chat", () => {
  it("should return a valid recipe", async () => {
    // User input
    const content = "Tomatoes, box of pasta, olive oil, and some spices";

    // Create a new request
    const request = new NextRequest(`${baseUrl}/api/chat`, {
      method: "POST",
      body: JSON.stringify({ messages: [{ role: "user", content }] }) as any,
    });

    // Send the request
    const res = await POST(request);

    // Check the status code
    expect(res.status).toEqual(200);

    // Get the response text and destreamify it
    const respText = destreamify(await res.text());

    // Check if the response text fulfills the criterion
    await expect(respText).toFulfillCriterion("Returns a recipe");
  });
}, 30000);
