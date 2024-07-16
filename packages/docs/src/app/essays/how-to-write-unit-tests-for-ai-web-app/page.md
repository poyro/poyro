---
title: How To Write Unit Tests for Your AI Web App
---
**By**: [Daniel Bulhosa Solorzano](https://x.com/danielbulhosa)

In this essay we discuss the common components of AI systems that typically need to be tested: retrieval and generation. We then discuss the major two categories of tests for AI apps: code-based and LLM-based. 

There are many types of code-based and LLM-based tests. We will present examples from real use-cases and provide code examples for each. We draw from a variety of use cases to demonstrate the generality of these concepts.

The TL;DR is that there is no silver bullet: Different types of tests are better suited to different components and typically trade off along these dimensions:

- Runtime and cost
- Test flakiness vs. manual effort to create tests
- Low effort vs. custom fit to use case

Let's get started!

## Common Components of AI Systems

### Retrieval and Generation

The Poyro team has built its own AI applications and chatted with other full-stack engineering teams that have done the same. Most AI systems contain the following two components, which compose the pattern known as RAG:

- **Retrieval**: Get some use case specific data that is passed to the LLM. This data could come from a database, a file, or elsewhere.
- **Generation**: Given prompt with instructions and (typically) some context, generate a response to serve some user or system request. The response could be free-text and/or a structured respose (e.g. JSON).

### Example of RAG in a System

Many AI systems can be decomposed into retrieval and generation, even complex ones that use the two components multiple times. Here is a diagram for a web agent system where the web agent is able to control a browser:

![Web Agent](/web-agent.png)

Note that each of the blue boxes in this diagram represent an agent combining a retrieval and generation step:

- The action agent retrieved the name, URL, and screenshot for the current page and generated 1 of 5 possible actions to take, an enum.
- Conditional on a `NAVIGATE` action, a link agent would run which would query a vector database of useful pages to navigate to, retrieve the top 10 matches, and then ask an LLM to generate the top choice given these 10.

The Poyro team has found that the most effective way to improve a system overall is to test each of the components indepedently. While E2E tests should be used for final validation, component tests provide the most actionable signal for improvements.

### How Can We Improve These Components

Ultimately the goal of component tests is to improve the performance of the AI app to produce the best user experience. For each component, these are some of the levers that we have to improve them:

- Retrieval:
  - The vector DB index: Which model is used to create the index? What columns are used in the index?
  - How do the rows of the DB break up the content: Every 200 characters? Per paragraph? Something else?
  - Does your DB or text file contain all of the data needed for your app? Does it contain any extraneous data?
- Generation:
  - The prompt: including instruction quality and output format.
  - The choice of model and model call configuration (e.g. temperature).

When looking at examples of tests below, this should help you understand what you can change to get the test to pass. Let's discuss now how to test the components.

## Writing Tests for AI Apps

### Code-Based Tests

These are regular, plain unit tests. They tend to be cheap and fast to run, and provide unambiguous signal about the problem. Their main drawback is that they cannot answer open ended questions about our AI feature's output and only work when the AI outputs structured outputs (e.g. enums).

#### Testing Generation: Validity

Many AI applications output structured or semi-structured content, such as JSON or code. In this special case we can simply check whether the output conforms to the expected syntax or schema. For example, let's say that we have an AI app that generates Liquid templates for marketing messaging. We can check this syntax as follows in [Vitest](https://vitest.dev/guide/) (a modern testing framework with a Jest-like API):

```js
import { vi, describe, it, expect } from 'vitest';

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
    // liquidjs function checking syntax validity
    const responseIsValid = isValidLiquidTemplate(mockedOpenAIResponse);
    expect(responseIsValid).toBe(true);
  })
})
```

In this example if the test failed we may add more information about Liquid's syntax to the prompt, to improve generation. We could also provide Liquid examples, fine-tune the model to learn Liquid better, or change to a better model (maybe GPT-3.5 to 4o).

It is best to run these tests first, as if your AI call cannot generate valid syntax it's unlikely the rest of your app will work. In this case, there is no point running the rest of the tests.

#### Testing Generation: Expected Values

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

#### Testing Retrieval

Let's say we have an AI that provides support for Amazon merchants by reading the help center and providing answers. Let's say that the user asks this AI: `How do I list an item for sale on Amazon?` The system queries a vector database with 6 articles and feeds the top 3 to an LLM to generate the answer. Here are the articles, with the returned ones shaded in grey:

![Amazon Article Table](/retrieval-amazon.png)

We can use [classic information retrieval](https://en.wikipedia.org/wiki/Evaluation_measures_(information_retrieval)#Offline_metrics) (i.e. search) performance measures to test our system. The higher they both are the better, though it's often a trade-off:

- **Precision**: Of the articles returned (in the top 3) what % are relevant? Note that out of 3 articles returned, 2 were relevant so the precision in this example for this query is 2/3 = 66%.
- **Recall**: Of all relevant articles in the database, what % did we return? Note that there are 4 relevant articles in the database, and we only returned 2 so the recall is 2/4 = 50%.

Here's what code to check this could look like:

```js
// These are typically a design choice
const minPrecision = 0.50;
const minRecall = 0.50;

describe("query 1 meets precision / recall bar", () => {
  const testQuery1 = "How do I list an item for sale on Amazon?";
  const relevantArticlesForQuery1 = new Set([1, 2, 3, 4]);
  const numReturnedArticles = 3;
  // Function that queries vector DB, returns a list of article IDs
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

In addition to writing tests with code we can write tests that leverage LLMs to answer more complex questions. As was discussed in a [prior essay](/essays/ai-testing-as-part-of-fullstack-engineering#unit-testing-llms-using-llms), LLM-based tests are the best choice when:

- The output of your LLM call is unstructured; for example a free text response to a customer support query.
- The criterion you want to check the LLM output against is open ended (hard to test with few assertions), e.g. does the SEO text generated by my AI marketing app contain a "call to action"?

Note that since these tests require using an LLM their latency is generally higher than code-based ones. If a remote LLM provider is used, these tests will cost money each time they are run. This is why Poyro uses a [locally run LLM](/how-does-it-work) to run your tests, to remove cost as a friction point for testing.

#### Testing Retrieval

In order to test retrieval in the prior section, we had to review each record in the DB and mark it as relevant or not to the user query. This is not feasible in a real-life scenario, in which a knowledge database could have thousands or millions of records.

The RAGAS (RAG Assessment) framework provides an approach to circumvent the problem. Instead of reviewing the relevance of individual database rows, we use a single example of the ideal LLM output to test of retrieval efficiency. The key is to break up the LLM output into distinct **statements**.

Let's say we are building an educational app that answers questions about historical figures, giving a short summary of facts about them. Imagine that the user query to this system is `Tell me about Albert Einstein`. Our ideal output may look something like:

```js
// We write this as a test target, this does NOT come from an LLM call
const idealLLMOutput = "Albert Einstein was a theoretical physicist. He was born on March 14th, 1879. Einstein is famous for developing the theory of relativity. He is also known for his contributions to the study of the photoelectric effect."
```

A naive way to break this into statements for illustration purposes might be: 
```js
const idealOutputStatements = idealLLMOutput.split(".")
```

This will give us an array of the sentences in the ideal output. We can query our facts database to get actual context our app would fetch:

```js
const query = "Tell me about Albert Einstein";
const actualContexts = retrieveFacts(query, 3); // Queries our vector DB

/* Returns the array:
   [
      "Albert Einstein was a theoretical physicist",
      "Albert Einstein was born on March 14th, 1879",
      "Albert Einstein developed the theory of relativity",
   ]
*/
```

With this data we can calculate a modified version of precision and recall:

- **Context Precision**: What % of statements retrieved are in the ideal output?
- **Context Recall**: What % of statements in the ideal output are present in our retrieved statements?

Note that although the definition for precision and context precision are different, these two metrics capture the same concept. The same is true for recall and context recall.

Poyro provides a function [outputFulfillsCriterion](/sdk-reference/output-fulfills-criterion) that we can use to determine which statements in the ideal output are attributable to the context and count them:

```js
import { outputFulfillsCriterion } from "@poyro/vitest/fn";

const countAttributableStatements = async (
  statementsToAttribute, 
  contextToAttributeTo,
  criterion,
  ) => {
  let numStatementsAttributableToContext = 0;

  for (statement of statementsToAttribute) {
    for (context of contextToAttributeTo) {
      const isStatementAttributableToContext = await outputFulfillsCriterion(
        statement,
        criterion,
        context,
      );

      if (isStatementAttributableToContext) {
        numStatementsAttributableToContext += 1;
        break;
      }
    }
  }

  return numStatementsAttributableToContext;
}
```

We can then use this function to calculate the context precision and context recall:

```js
const minPrecision = 0.50;
const minRecall = 0.50;

describe("meets precision and recall targets", () => {
  // Note that all statements in the context are present in the output.
  // Thus this variable will be equal to 3.
  const numStatementsAttributableToContext = countAttributableStatements(
    idealOutputStatements, 
    actualContexts,
    "output information can be attributed to information in additional context",
  );
});
```

The context precision will be 100% since we have 3 statements in the ideal output we can attribute to the context, out of 3 statements in the context overall:

```js
  it("meets precision target", () => {
    contextPrecision = numStatementsAttributableToContext / actualContexts.length;
    expect(contextPrecision).toBeGreaterThanOrEqual(minPrecision);
  })
```

The context recall will be 75% since we have 3 statements in the ideal output we can attribute to the context, out of 4 statements in the ideal output. The unattributed sentence is `He is also known for his contributions to the study of the photoelectric effect.` which was not present in our context. An actual LLM output would thus have failed to capture this information, this is what the lower recall tells us.

```js
  it("meets recall target", () => {
    contextPrecision = numStatementsAttributableToContext / idealOutputStatements.length;
    expect(contextPrecision).toBeGreaterThanOrEqual(minRecall);
  })
```

To keep precision high, we need to make sure we're always retrieving all of the statements in our ideal context. To increase recall, we need to make sure that our query retrieves from the DB all of the facts we want in our ideal output.

#### Testing Generation

In the above we tested the retrieval step. We can take a similar approach to test the generation step. This time, instead of using the ideal output and the actual retrieved data, we use the actual output and the ideal retrieved data.

Here are our user query and the ideal retrieved context:

```js
const query = "Tell me about Albert Einstein";
const idealContext = [
  "Albert Einstein was a theoretical physicist",
  "Albert Einstein was born on March 14th, 1879",
  "Albert Einstein developed the theory of relativity",
];
```

And here is a function to make our actual LLM return:
```js
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
```

We call our LLM caller to get the actual LLM output:

```js
const actualOutput = provideSummaryOfHistoricalFigure(input, idealContext);
const actualOutputStatements = actualOutput.split(".");

/* Actual output generated by LLM is:
   "Albert Einstein was a biologist born on March 14th, 1990. He developed the theory of relativity. Thomas Edison invented the lightbulb."
*/
```

With this data we can calculate the following RAGAS metrics that measure generation quality:

- **Answer Relevancy**: What % of statements in the actual output are relevant to the query? Measures how well the output aligned with the user's request.
- **Faithfulness**: What % of statements in the actual output can we attribute to the ideal context? Measures how well the prompt and model use the context data.

We can reuse the function `countAttributableStatements` we defined in the prior section to calculate the number of statements in the actual output relevant to the user query,

```js
const minRelevancy = 0.50;
const minFaithfulness = 0.50;

describe("meets relevancy and faithfulness targets", async () => {

  const numStatementsRelevantToQuery = countAttributableStatements(
    actualOutputStatements, 
    [query],
    "output information can be attributed is relevant to user query passed in additional context",
  )
});
```

and the number of statements in the actual output attributable to the ideal context:

```js
  const numStatementsAttributableToContext = countAttributableStatements(
    actualOutputStatements, 
    actualContexts,
    "output information can be attributed to information in additional context",
  );
```

We can use `numStatementsRelevantToQuery` variables to calculate the answer relevancy. Note since 3 out of the 4 sentences actually discuss Einstein, the answer relevancy will be 3 / 4 = 75%:

```js
  it("meets relevancy target", () => {
    answerRelevancy = numStatementsRelevantToQuery / actualOutputStatements.length;
    expect(contextPrecision).toBeGreaterThanOrEqual(minPrecision);
  })
```

We can calculate the faithfulness with `numStatementsAttributableToContext`. In this case since only 1 statement in the actual LLM output is a factual statement about Einstein that we can verify with the context, the faithfulness is 1 / 4 = 25%:

```js
  it("meets faithfulness target", () => {
    // (1 statements in output attributable to context) / (4 statements in output) = 25%
    faithfulness = numStatementsAttributableToContext / actualOutputStatements.length;
    expect(contextPrecision).toBeGreaterThanOrEqual(minRecall);
  })
```

To increase relevance we could emphasize in the prompt that the LLM response should only contain facts about the historical figure in the user query. To increase the faithfulness we may want to use a better model since the current model is doing pretty poorly here.

#### Testing Generation (Custom)

Most often, the metrics most useful to any project are tailored to it. LLM-based tests provide us immense flexibility to do this by allowing us to turn any natural language criterion into a binary condition. These binary conditions can be converted into assertions.

In cases where we have a binary conditions, our best option is Poyro's [toFulfillCriterion](/sdk-reference/to-fulfill-criterion) matcher. Let's say we have a legal assistance app, that explains legal terminology to young adults getting their first job.

In this example the test using prompt one fails because prompt one returns too complicated an answer:

```js
describe("AI legal assistance is understandable to young layperson", () => {
  it("prompt 1: should be understandable to 10th grader", async () => {
    const prompt1Output = callOpenAIWithPrompt1();
    // Returns: "A Non-Disclosure Agreement (NDA) is a legally binding contract in which one party agrees to keep certain information shared by another party confidential. It outlines the scope of the confidential information and the obligations of the receiving party to protect it."

    await expect(prompt1Output).toFulfillCriterion(
      "should be understandable to 10th grader"
    ); // fails, too technical
  })
});
```

Prompt two passes because it returns a simpler explanation:

```js
  it("prompt 2: should be understandable to 10th grader", async () => {
    const prompt2Output = callOpenAIWithPrompt2();
    // Returns: "A Non-Disclosure Agreement (NDA) is a legal deal where one person promises not to share certain secret information they learn from another person. It's like agreeing to keep a friend's secret safe and not tell anyone else."

    await expect(prompt2Output).toFulfillCriterion(
      "should be understandable to 10th grader"
    ); // passes!
  })
```

Other times we may want to construct an assertion out of an aggregation of boolean conditions. As we saw in the prior sections, this is exactly where [outputFulfillsCriterion](/sdk-reference/output-fulfills-criterion) is the best fit. Let's say our app makes recommendations about best practices for writing NDAs. Let's say we have a file of best practices:


```js
const bestPractices = loadPracticesFromFile();
/* Returns:
[
  `Clearly define what constitutes "Confidential Information" to avoid misunderstandings.`,
  `Specify the duration for which the information must remain confidential.`,
  `Include exceptions for information that is publicly known or independently developed.`,
]
*/
```

We may want to check that the output of our AI legal agent,

```js
const aiLegalAdvice = aiLegalAdvisor("Tell me a best practice regarding treatment of information in an NDA");
// Returns: `It is recommended that both parties clearly define what information should be labeled "Confidential".`
```

is attributable to one of these best practices in the file. To do this we write a method to check if our recommendation can be atttributed to **any** of our best practices on file:

```js
import { outputFulfillsCriterion } from "@poyro/vitest/fn";

const isAttributableToAnyContext = async (
  recommendation,
  contextToAttributeTo,
  criterion,
  ) => {

  for (context of contextToAttributeTo) {
    const isStatementAttributableToContext = await outputFulfillsCriterion(
      recommendation,
      criterion,
      context,
    );

    if (isStatementAttributableToContext) {
      return true;
    }
  }

  return false;
}
```

This is similar to the `countAttributableStatements` in the prior section, except this time we don't count the number that we can attribute, we only care that we can attribute at least 1.

```js
it("can attribute legal recommendation to some best practice in file", () => {
  const isAttributable = isAttributableToAnyContext(
    aiLegalAdvice,
    bestPractices,
    "legal advice from AI agent can be attributed to the best practice in the additional context",
  );

  // Pass since output is attributable to first best practice in file
  expect(isAttributable).toBe(true);
})
```

---

Phew, we made it to the end! I hope you found it valuable. The learnings from this article should be transferrable to any use case, language, or framework.

For JS, Poyro provides an open source, no cost tool that makes it easy to [get started](/#usage) using Vitest and our custom functions / matchers to write tests for your AI app.

Are you unsure which standard test would be the best fit for your project? Want ideas for how to brainstorm on custom tests for your specific domain? Send me a [message on Twitter](https://x.com/danielbulhosa) or reach us on our [Discord](https://discord.com/invite/gmCjjJ5jSf)!
