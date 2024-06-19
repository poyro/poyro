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
    const respText =  destreamify(await res.text());

    // Check if the response text fulfills the criterion
    await expect("not a recipe").toFulfillCriterion("Returns a recipe");
  });
}, 30000);

describe("Test fixed values", () => {
  it("should contain only statements that do not contradict", async () => {
    await expect("The sky is blue").toFulfillCriterionAgainstEvery(
      "Check that the LLM response does not contradict the statements below",
      [
        "The earth is round",
        "The sky is red",
        "The grass is green",
      ],
    );
  })

  it("should contain at least one statement that does not contradict", async () => {
    await expect("The sky is blue").toFulfillCriterionAgainstSome(
      "Check that the LLM response does not contradict the statements below",
      [
        "The earth is round",
        "The sky is red",
        "The grass is green",
      ],
    );
  })

}, 30000)