---
title: How To Write Unit Tests for Your AI Web App
---
**By**: [Daniel Bulhosa Solorzano](https://x.com/danielbulhosa)

In this longer-form essay we discuss the common components of AI systems that typically need to be tested: retrieval and generation. We then discuss the major two categories of tests for AI apps: code-based and LLM-based. 

There are many types of code-based and LLM-based tests. We will present examples from real use-cases and provide code examples for each. We draw from a variety of use cases to demonstrate the generality of these concepts.

The TL;DR is that there is no silver bullet: Different types of tests are better suited to different components and typically trade off along these dimensions:

- Run time / cost
- Requirement for manual labels vs. noise
- Low effort vs. customization

Let's get started!

## Common Components of AI Systems

### Retrieval and Generation: RAG

We have built our own AI applications and chatted with other full-stack engineering teams that have done the same. Most AI systems contain the following two components, which compose the pattern known as RAG:

- **Retrieval**: Get some use case or company specific context that is passed to the LLM. This could be the results from a query to a vector database of documents or just passing a text file with the names of variables for your users' data. It could even be the result of the generation step from a prior LLM call.
- **Generation**: Given prompt with instructions and (typically) some context, generate a response to serve some user or system request. The response could be open-end (e.g. a free text response to a customer support query) or a structured respose (e.g. an enum or some constrained JSON schema).

### Example of RAG in a System

Many AI systems can be decomposed into this pattern, even complex ones that reuse these components multiple times. Here is a diagram for a web agent system where the web agent is able to control a browser:

![Web Agent](/web-agent.png)

Note that each of the blue boxes in this diagram represent an agent combining a retrieval and generation step:

- The action agent retrieved the name, URL, and screenshot for the current page and generated 1 of 5 possible actions to take, an enum.
- Conditional on a `NAVIGATE` action, a link agent would run which would query a vector database of useful pages to navigate to, retrieve the top 10 matches, and then ask an LLM to generate the top choice given these 10.

We have found that the most effective way to improve a system overall is to test each of the components indepedently. E2E tests should be used for final validation, but component tests provide the most actionable signal for improvements.

### How Can We Improve These Components

These are the levers that we have to improve each of our components:

- Retrieval:
  - The vector DB index: which model is used to create it and what columns are used for it.
  - What each row of your DB represents: 200 characters, a paragraph, content under HTML headers, etc.
  - Does your DB or text file contain all of the data needed for your app and does it contain any extraneous data?
- Generation:
  - The prompt: including instruction quality and output format.
  - The choice of model and model call configuration (e.g. temperature).

When looking at examples of tests below, this should help you understand what you can change to get the test to pass. Let's discuss now how to test the components.

## Writing Tests for AI Apps

### Code-Based Tests

These are regular, plain unit tests. They tend to be cheap and fast to run, and provide unambiguous signal about the problem. Their main drawback is that they are not able to answer more open ended questions about our AI feature's output, and only work when the AI outputs structured outputs (e.g. text spans, enums, etc.).

#### Test Generation: Validity

Many AI applications output structured or semi-structured content, such as JSON or code. In this special case we can simply check whether the output conforms to the expected syntax or schema. For example, let's say that we have an AI app that generates Liquid templates for marketing messaging. We can check this syntax as follows in [Vitest](https://vitest.dev/guide/) (a modern testing framework with a Jest-like API):

```js
import { vi, describe, it, expect } from 'vitest';

function isValidLiquidTemplate(template) {
  // Logic for checking that a template is valid using liquidjs
  //...
}

const mockPrompt = "Write a message to the user telling with a yummy message about McNuggets if they've ever purchased them, or a message about the releasing a new McFlurries flavor if not. To create the conditional logic, you should use the Liquid templating language."
const mockResponse = `{{# if ordered_mcnuggets}}
Hi {{first_name}}, We know you love McNuggets, so here's a $2 off coupon just for you!
{{else}}
Hi {{first_name}}, We just released a new McFlurries flavor, wanna check it out?
{{/if}}`
const mockOpenAICallFromPrompt = vi.fn((dummyPrompt) => mockResponse)

describe("test AI returns valid syntax", () => {
  it("should return a valid Liquid message", () => {
    const mockedOpenAIResponse = mockOpenAICallFromPrompt(mockPrompt);
    const responseIsValid = isValidLiquidTemplate(mockedOpenAIResponse);
    expect(responseIsValid).toBe(true);
  })
})
```

In this example if the test failed we may add more information about Liquid's syntax to the prompt, to improve generation. We could also provide Liquid examples, fine-tune the model to learn Liquid better, or change to a better model (maybe GPT-3.5 to 4o).

It is best to run these tests first as if your AI call cannot generate valid syntax it's unlikely the rest of your app will work, so no point in running other tests.

#### Test Generation: Expected Values

A common unit testing pattern is to check that the function being tested returns an expected value. This is still true with LLM responses, where we can check that the return message either matches a value exactly or a subtring contains some expected values.

Continuing with the example above, since we know that our prompt mentions two products `McNuggets` and `McFlurries` we may want to check that the generated Liquid templates mentions these. Otherwise it's not a very good marketing message for these products!

```js
describe("AI generated marketing message contains target products", () => {
  const mockedOpenAIResponse = mockOpenAICallFromPrompt(mockPrompt);

  it("should contain the product 'McNuggets'", () => {
    expect(mockedOpenAIResponse).toContain('McNuggets');
  })
  it("should contain the product 'McFlurries'", () => {
    expect(mockedOpenAIResponse).toContain('McFlurries');
  })
})
```

To improve this example we could change the prompt to tell the LLM that it is **required** to include the names of the products.

Another example could be that you're building logic to classify products into food vs. retail based on the products' names:

```js
function getFoodRetailLabelFromName(name) {
  const prompt =`You are an expert at telling the difference between products that are food items vs. retail items based on their name. Retail items may include things like clothes. Food items are anything that is edible, including if it's prepackaged like candy or canned food.
  
You will classify the following item: '${name}'

You will return one of these two labels: FOOD or RETAIL. Only return a single token with one of these labels. Do not return anything else.`

  return openAICallWithPrompt(prompt);
}

describe("AI correctly classifies items as FOOD or RETAIL", () => {
  const shouldBeFood = openAICallWithPrompt('Canned Tomato Soup, 12oz');
  const shouldBeRetail = openAICallWithPrompt('Banana T-Shirt');

  it("should classify as food", () => {
    expect(shouldBeFood).toBe('FOOD');
  })
  it("should classify as retail", () => {
    expect(shouldBeRetail).toBe('RETAIL');
  })
})
```

To improve this prompt we could have included more examples of what contitutes a `RETAIL` item vs. a `FOOD` item.

Note that the two tests above required us not only to write an example but also the value we expect to be returned by our AI call.

#### Test Retrieval

Let's say we have an AI that provides support for Amazon merchants by reading the help center and providing answers. Let's say that the user asks this AI: `How do I list an item for sale on Amazon?` The system queries a vector database with 6 articles and feeds the top 3 to an LLM to generate the answer. Here are the articles, with the returned ones in gray shading:

![Amazon Article Table](/retrieval-amazon.png)

We can use [classic information retrieval](https://en.wikipedia.org/wiki/Evaluation_measures_(information_retrieval)#Offline_metrics) (i.e. search) performance measures to test our system. The higher they both are the better, though it's often a trade-off:

- **Precision**: Of the articles returned (in the top 3) what % are relevant? Note that out of 3 articles returned, 2 were relevant so the precision in this example for this query is 2/3 = 66%.
- **Recall**: Of all relevant articles in the database, what % did we return? Note that there are 4 relevant articles in the database, and we only returned 2 so the recall is 2/4 = 50%.

Here's what code to check this could look like:

```js
function queryArticleDatabase(textQuery, limit) {
  // Logic to query vector database, returns article IDs list
}
// These are typically a design choice
const minPrecision = 0.50;
const minRecall = 0.50;

describe("query 1 meets precision / recall bar", () => {
  const testQuery1 = "How do I list an item for sale on Amazon?";
  const relevantArticlesForQuery1 = new Set([1, 2, 3, 4]);
  const numReturnedArticles = 3;
  const retrievedArticles = queryArticleDatabase(testQuery1, numReturnedArticles); // [2, 5, 3]
  const numRelevantArticles = retrievedArticles.filter(
    id => relevantArticlesForQuery1.has(id)
  ).length;

  it("has higher precision than threshold", () => {
    expect(numRelevantArticles / numReturnedArticles).toBeGreaterThanOrEqual(minPrecision);
  });
  it("has higher recall than threshold", () => {
    expect(numRelevantArticles / relevantArticlesForQuery1).toBeGreaterThanOrEqual(minRecall);
  });
})
```
In this case perhaps articles `4` and `1` fail because the indexer gets distracted by the terms `Advanced settings` and `photography`. Solutions could include using a better model that knows to ignore these terms given the query, or extracting keywords from the query, e.g. `item` and `sale` and using keyword-based search on top of the vector search.

Note that this testing approach requires we label the relevant articles for each query.

### LLM-Based Tests

Instead of writing tests with code we can write tests that leverage LLMs to answer more complex questions. As was discussed in a [prior essay](/essays/ai-testing-as-part-of-fullstack-engineering#unit-testing-llms-using-llms), LLM-based tests are the best choice when:

- The output of your app LLM call is unstructured, like for example a free text response to a customer support query.
- The criterion you want to check the LLM output against is open ended (hard to check with a handful of rules), e.g. does the SEO text generated by my AI marketing app contain a "call to action"?

Note that since these tests require using an LLM their latency is generally higher than code-based ones. If a remote LLM provider is used, these tests will cost money each time they are run. This is why Poyro uses a [locally run LLM](/how-does-it-work) to run your tests, to remove cost as a friction point for testing.

#### Test Retrieval: RAGAS

When testing retrieval as in the previous section, it can get time consuming to review every row in your database for relevance to a given test query. If your database has a realistic number of records it can quickly become impractical. 

The RAGAS (RAG Assessment) framework provides an approach to circumvent the problem. Instead of labeling relevant database rows, we use a single example of the ideal LLM output to test of retrieval efficiency. The key is to break up the LLM output into **statements**.

Let's say we are building an educational app that answers questions about historical figures, giving a short summary of facts about them. Let's say the user query to this system is `Tell me about Albert Einstein`. Our ideal output may look something like:

```js
// We write this as a test target, this does NOT come from an LLM call
const idealLLMOutput = "Albert Einstein was a theoretical physicist. He was born on March 14th, 1879. Einstein is famous for developing the theory of relativity. He is also known for his contributions to the study of the photoelectric effect."
// A naive way to break this into statements for illustration purposes
const idealOutputStatements = idealLLMOutput.split(".")
```

This will give us an array of the sentences in the ideal output. We can query our facts database to get actual context our app would fetch:

```js
function retrieveFacts(query, limit){
  // Logic to query vector database, returns array
}

/* Returns the array:
   [
      "Albert Einstein was a theoretical physicist",
      "Albert Einstein was born on March 14th, 1879",
      "Albert Einstein developed the theory of relativity",
   ]
*/
const query = "Tell me about Albert Einstein";
const actualContext = retrieveFacts(query, 3);
```

With this data we can calculate a modified version of precision and recall:

- **Context Precision**: What % of statements retrieved are in the ideal output?
- **Context Recall**: What % of statements in the ideal output are present in our retrieved statements?

Note that although the definition is different these measures capture the same concepts: precision still measures how much of the data retrieved was relevant, and recall still measures how much of all relevant data was retrieved. Here is how the matchers provided by [Poyro](/) can be used to write tests based on these:

**FIXME**: API to do this in Poyro is currently awkward. Include links to API.

#### Test Generation: RAGAS

In the above we tested the retrieval step. We can take a similar approach to test the generation step by hardcoding the ideal context we want retrieved and testing the actual output of the LLM in the AI app. 

```js
const query = "Tell me about Albert Einstein";
const idealContext = [
  "Albert Einstein was a theoretical physicist",
  "Albert Einstein was born on March 14th, 1879",
  "Albert Einstein developed the theory of relativity",
];

function provideSummaryOfHistoricalFigure(input, context) {
  const contextList = context.map(item => `- ${item}`).join('\n');
  const prompt =`You are an expert at providing summaries regarding historical figures. You will be provided a set of facts about a historical figure and assemble them into a paragraph summarizing them.

  Here was the user query: "${input}"

  Here is the set of facts you will use, separated in bullets:
  ${contextList}

  Return the facts in a single paragraph, each fact in a separate sentence.
`

  return openAICallWithPrompt(prompt);
}
// Actual output generated by LLM is:
// "Albert Einstein was a biologist born on March 14th, 1990. He developed the theory of relativity. Thomas Edison invented the lightbulb."
const actualOutput = provideSummaryOfHistoricalFigure(input, idealContext);
const actualOutputStatements = actualOutput.split(".");
```

With this data we can calculate the following RAGAS metrics that measure generation quality:

- **Answer Relevancy**: What % of statements in the actual output are relevant to the query? Measures how well the output aligned with the user's request.
- **Faithfulness**: What % of statements in the actual output can we attribute to the ideal context? Measures how well the prompt and model use the context data.

We can use the matchers provided by Poyro to check these measures:

**FIXME**: API to do this in Poyro is currently awkward. Include links to API.

#### Test Generation: Custom

Although the RAGAS metrics are useful and provide a standard target for AI app development, their genericness limits their utility. Most often, the metrics most useful to any project are tailored to it. LLM-based tests provide us immense flexibility to do this by allowing us to turn any natural language criterion into a binary assertion.


**FIXME**: Complete code examples. Existing matcher is sufficient. Include links to API.

---

Poyro is an open source, no cost tool that makes it easy to [get started](/#usage) using JS, Vitest, and our custom matchers to write tests for your AI app.

Are you unsure which standard test would be the best fit for your project? Want ideas for how to brainstorm on custom tests for your specific domain? Send me a [message on Twitter](https://x.com/danielbulhosa) or reach us on our [Discord](https://discord.com/invite/gmCjjJ5jSf)!
