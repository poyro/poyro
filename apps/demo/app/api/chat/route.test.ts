import request from "supertest";
// import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";

const baseUrl = "http://localhost:3000";

const destreamify = (str: string) => {
  return str.replaceAll('0:"', "").replaceAll('"\n', "");
};

describe("POST /api/chat", () => {
  it("should work", () => {
    // const content = "Tomatoes, box of pasta, olive oil, and some spices";

    // const res = await request(baseUrl)
    //   .post("/api/chat")
    //   .send({ messages: [{ role: "user", content }] });

    // expect(res.status).toEqual(200);

    // const respText = destreamify(res.text);

    // console.log(respText);

    expect("hi").toFulfillCriterion();

    // expect(res.body).toEqual("");
  }, 15000);
});
