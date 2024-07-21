---
title: Case Study - Unit Testing a Legal AI App
---
**By**: [Daniel Bulhosa Solorzano](https://x.com/danielbulhosa), [Leo Paz](https://x.com/LeosReal)


The power of unit testing AI comes into view when focused through the lens of a concrete use case. The Poyro team is collaborating with [Outlit AI](https://outlit.ai/) to figure out the best way to test their legal assistant. This case study presents end to end how we brainstormed test ideas based on legal and AI best practices, and how the Outlit team translated them into tests using Poyro.

## What is the Use Case?

Before we dive in, we need to understand the use case: Outlit is an AI app for building sales contracts. Outlit provides a variety of agents to analyze your contract and provide feedback:

![Outlit Agents](/outlit-agent-closeup.png)

The agents are capable of highlighting risky clauses in the contract and provide recommendations for how to update them, including candidate replacements along with explanations for those replacements. Here we show a problematic clause highlighted by app, along with a proposed replacement:

![Outlit Contract Suggestion](/outlit-contract-closeup.png)

And here is the explanation for the recommended change, through the lens of the impact on negotiation. Note that the app is trying to help the **Seller** update the contract:

![Outlit Suggestion Reasoning](/outlit-revision-closeup.png)

The app detects and displays all such problematic clauses along with candidate replacements and explanations from Outlit's agents. If you look closely, you may already notice some issues we should catch with tests — bonus points if you catch them before getting to the testing section!

With this context, let's think about how we should approach testing.

## Brainstorming Tests

This is a complex application; like any such software, the starting point for writing good tests is:

- Decomposing the system into smaller components with well defined inputs and outputs.
- Articulating the high level objective of the system and decompose this into measurable outputs.

### System Decomposition

The first natural component to consider is individual agents in the Outlit app. For the remainder of this article we will focus on the negotiation risk agent, though we can apply the same process to the others.

Next we notice that the negotiation risk agent ingests a contract, detects risky clauses, and for each such clause returns:

1. The substring for the clause, defined by some start and end index.
2. An explanation of the risk the agent detected in that clause.
3. A proposed replacement clause, which considers the detected risk.

For each contract many such triples of data may be returned by the app, one for each risky clause. Testing all of the changes proposed by the negotiation risk agent simultaneously would be challenging and ambiguous. However testing each change individually makes the problem tractable. Thus, our test cases will be an input and the three outputs listed above.

### Measurable Objectives

Having decomposed the unit to test down to clauses, the next question to answer is: What determines whether the legal agent's risky clause detection and replacement is acceptable?

1. When the agent **detects the right substring** to replace.
2. When the provided explanations are **accessible to non-legal staff**, since the goal of the app is to help non-legal staff make sales contracts.
3. When the replacement clause is "acceptable", which is not immediately obvious.

Let's explore #3 further. Leveraging a consultation with a domain expert (a lawyer), researching relevant literature, and brainstorming using knowledge tools like ChatGPT, we can come up with requirements based on legal best practices. A replacement clause is acceptable if:

- 3.a) It is **consistent** with the other clauses in the contract: If the AI suggests a contradictory clause and the user accepts it, this could render parts of the contract invalid.
- 3.b) It is grounded on **best practices**: With a critical application like a legal AI assistant, we should not rely on the model's knowledge to come up with best practices. We should rely on a curated set of best practices and make sure the AI sticks to them.

This only represents a couple of the requirements we can track, other ideas could include whether any recommended clauses are enforceable, whether they are at least neutral if not favorable to the seller (our client), etc.

Equipped with a system decomposition and set of objectives, we're ready to write some tests!

## Implementing Tests

As discussed on Poyro's [guide for writing unit tests for AI apps](/essays/how-to-write-unit-tests-for-ai-web-app), there are a couple of different types of tests we'll need to write to measure our objectives:

- [Code-Based Tests](/essays/how-to-write-unit-tests-for-ai-web-app#testing-generation-expected-values): For condition 1., given a test contract we can determine ahead of time the problematic substrings we want to detect with the help of a lawyer. We can then check our AI app detects the same substrings.
- [LLM-Based Tests](/essays/how-to-write-unit-tests-for-ai-web-app#llm-based-tests): The conditions defined by objective 2., 3.a., and 3.b. require analyzing free text and evaluating open ended criteria. However, it's hard to write a code-based test that checks that a clause is accessible to a non-legal. This is exactly the situation in which LLM-Based Tests are useful.

We will be working from the example from the use case section. Here we can see the input and outputs 1. the substring to replace, and 3. the replacement clause:

![Outlit Contract Suggestion](/outlit-contract-closeup.png)

And here we see output 2. the reasoning for the replacement:

![Outlit Suggestion Reasoning](/outlit-revision-closeup.png)

### 1. Risky Clause Detection

From consulting with a legal expert we can determine that the problematic clause should include not only the sentence currently highlighted in red but also the prior sentence:

```text
The Seller does not cap the total cost for these services, and estimates provided prior to the commencement of work are non-binding.
```

Let's say that we are processing one contract section at a time. We can specify the start and end index of the problematic clause we want to detect relative to the full section body text:

```js
const sectionText = "Customization and integration services will be provided at an hourly rate of $300. The Seller does not cap the total cost for these services, and estimates provided prior to the commencement of work are non-binding. The Buyer agrees to pay for all customization and integration services upon invoice, irrespective of the project completion status.";

// Last index is non-inclusive
const actualSubtringIdx = [83, 347];
```

Let's assume that we have a function for detecting bad substrings. The function ingests the text from a section and returns an array of arrays containing all problematic, non-overlapping subtring index pairs:

```js
const predictedSubstringIdx = extractProblematicClauses(sectionText);
// Returns [[216, 347]]
```

Now, what we want to determine is how much the predicted substring and actual substring overlap. What would be some good qualities for a function that determined this?

- Returns a number from `0.0` to `1.0`, with `0.0` meaning no overlap and `1.0` meaning perfect overlap.
- If the predicted substring entirely contains the actual subtring but is not exactly equal to it, we want this function to return a number less than `1.0`. Same the other way around.

The latter point guarantees that `1.0` always means perfect overlap rather than one substring containing the other. Here is a function meeting these characteristics (in NLP this is called the [Jaccard Similarity](https://medium.com/@igniobydigitate/similarity-coefficients-a-beginners-guide-to-measuring-string-similarity-d84da77e8c5a)):

```js
const calculateOverlapPercentage = (substringIdx1, substringIdx2) => {
  /* Calculate what % of characters in the two strings overlap out of
     the total number of characters in both (without double counting overlaps).
  */

  const [start1, end1] = substringIdx1;
  const [start2, end2] = substringIdx2;

  let numOverlapping;
  // No overlap: one string ends before the other starts
  if (end1 - 1 < start2 || end2 - 1 < start1) {
    numOverlapping = 0;
  }
  else {
    // The overlap starts where the latest substring starts
    // and ends where the earliest substring ends
    const overlapStart = Math.max(start1, start2);
    const overlapEnd = Math.min(end1, end2);
    numOverlapping = overlapEnd - overlapStart;
  }

  // This will double count overlapping characters
  const totalCharacters = (end2 - start2) + (end1 - start1);
  // Remove double counted characters in overlap
  const totalCharactersDedup = totalCharacters - numOverlapping;

  return numOverlapping / totalCharactersDedup;
}
```

Now we can use this function and our data to write a test using [Vitest](https://vitest.dev/guide/):

```js
// This is a design choice
const minOverlap = 0.8;

it("detects the right risky clause substring", () => {
  // Returns ~0.50
  const percentageOverlap = calculateOverlapPercentage(
    actualSubtringIdx,
    predictedSubstringIdx,
  );
  // Will fail with given threshold
  expect(percentageOverlap).toBeGreaterThanOrEqual(minOverlap);
});
```

Voilà, we have a test that will measure the ability of AI lawyer to accurately determine problematic clauses. Note the same logic would work if we were indexing words, tokens, or sentences instead of characters.

### 2. Accessible to Non-Legal

Next we want to check whether the reasoning generated by the negotiation agent is accessible a non-legal staff member. Recall that the reasoning was:

```js
const reasoning = "Non-binding estimates can lead to significant cost overruns, which may deter the Buyer from engaging in customization and integration services. Providing binding estimates will encourage the Buyer to proceed with these services, benefiting the Seller.";
```

It is hard to capture the concept of being accessible in this way in terms of programmatic rules. This is exactly where [Poyro's](/) ability to test natural language conditions is valuable. We can define a natural language criterion as follows:

```js
const criterion = "The provided legal reasoning should be understandable to a person with a bachelor's degree, basic business understanding, but without a legal background.";
```

Note we are precise about describing the persona we are targeting. There are many different types of people without business backgrounds. Requring a bachelor's degree and specifying a basic business understanding attempts to ground the persona at an entry level of professional experience. We can get even more precise by providing context that elaborates on this:

```js
const additionalContext = `Here are some qualities of text accessible to non-legal persons to consider:

- It avoids using legal jargon.
- It uses short sentences that aren't overly structured to convey a precise legal point.
- It should use an approachable tone rather than a terse one.

Here are some qualities of a person with basic business understanding:
- They will understand basic business concepts like buying, selling, contracts, etc.
- They may not understand business jargon.`
```

We can then use Poyro's [toFulfillCriterion](/sdk-reference/to-fulfill-criterion) matcher to create a test from this specification:

```js
it("should be accessible to non-legal staff", () => {
  await expect(reasoning).toFulfillCriterion(
    criterion,
    additionalContext,
  );
});
```

Under the hood Poyro calls an LLM to assess the criterion that returns this JSON:

```js
{
  "feedback": "The response uses legal jargon ('binding estimates', 'customization and integration services') that may not be understandable to a person with basic business understanding. The tone is also formal, which may not be approachable for non-legal persons. The language is structured and precise, but not overly concise. Overall, the response does not meet the criterion of being understandable to a person with a bachelor's degree, basic business understanding, but without a legal background. False",
  "result": false
}
```

This could be an overly conservative assessment: There may be staff with only a bachelor's degree and no legal experience, but with enough professional exprience to understand the reasoning. However, this criterion will tend to favor explanations by the AI agent that make the platform more accessible to all non-legal staff.

If we change our prompt so it produces this response instead:

```js
const updatedReasoning = "If the seller and buyer do not have a way to agree on the cost of the seller's services ahead of time, the buyer may be relunctant to purchase these services.";
```

Then our test passes and Poyro returns the reasoning:

```js
{
  "feedback": "The response avoids using legal jargon and uses a clear, concise tone. It also conveys a precise point about the potential reluctance of a buyer to purchase services without prior agreement on cost. The language is approachable and easy to understand for someone with basic business understanding. Therefore, [True].",
  "result": true
}
```


### 3.a) Consistency

Next we want to check that updating the clause does not introduce contradictions into the section defined by `sectionText`. To do this we want to compare the recommended clause with the rest of the section.

We need to first extract the section without the removed clause:

```js
// Same as in `1. Risky Clause Detection` section
const predictedSubstringIdx = extractProblematicClauses(sectionText);

const [start, end] = predictedSubstringIdx;
const sectionTextMinusBadClause = (
  sectionText.slice(0, start) + 
  sectionText.slice(end)
);
/* Returns:
"Customization and integration services will be provided at an hourly rate of $300. The Seller does not cap the total cost for these services, and estimates provided prior to the commencement of work are non-binding."
*/
```

We also need to get the replacement clause:

```js
const problemClause = sectionText.slice(start, end);
/* Returns:
"The Buyer agrees to pay for all customization and integration services upon invoice, irrespective of the project completion status."
*/

// Some function which given a bad clause writes a better one
const replacementClause = generateReplacement(problemClause);
/* Returns:
"The Buyer agrees to pay for all customization and integration services upon invoice, with payment due within 30 days of the invoice date. The Seller will provide binding estimates prior to the commencement of work to ensure cost predictability for the Buyer."
*/
```

We can then compare the `replacementClause` with `sectionTextMinusBadClause` to see if we get any contradiction:

```js
it("should not find contradiction with new clause", () => {
  await expect(replacementClause).toFulfillCriterion(
    "does not contradict any of the text passed in the additional context",
    sectionTextMinusBadClause,
  )
});
```

If we run this test, Poyro correctly detects that `sectionTextMinusBadClause` states seller estimates are non-binding, whereas `replacementClause` states they are binding:

```js
{
  "feedback": "The response correctly states that the Seller will provide binding estimates prior to work commencement, which contradicts the original instruction. The instruction mentioned non-binding estimates. Therefore, the response does not meet the criterion.",
  "result": false
}
```

If we wanted to more granularly detect which part of `sectionTextMinusBadClause` contained the contradiction we could have broken it up into sentences and done a for loop over these with the same matcher. This can provide clearer signal in cases when the section is long.

### 3.b) Grounded on Best Practice

Lastly, we want to make sure that the replacement clause we are generating is based on some predefined set of best practices. In a typical system, these best practices may be present in a database or text file. For the purposes of this essay, we can mock a handful of best practices and put them into a text file, separated by newlines:

**best_practices.txt**
```txt
The contract must establish a structured dispute resolution framework.
The contract must secure comprehensive warranty coverage and support terms.
The contract must ensure financial clarity and planning accuracy regarding costs.
.
.
.
```

We can load and parse this file to get each of these practices as an array:

```js
import * as fs from 'fs';

const bestPracticeString = fs.readFileSync("best_practices.txt");
const bestPractices = bestPracticesString.split("\n");
```

We can check each element of the best practices array against our replacement clause recommendation. Then, we just need to check we were able to attribute the recommendation to **at least one** best practice. 

To do this, we can use Poyro's [outputFulfillsCriterion](/output-fulfills-criterion) function. This is the functional version of the matcher, which allows us to compute multiple boolean criteria before calling `expect`:

```js
import { outputFulfillsCriterion } from "@poyro/vitest/fn";

it("must be attributable to some best practice", () => {
  const replacementClause = generateReplacement(problemClause);
  /* Returns:
  "The Buyer agrees to pay for all customization and integration services upon invoice, with payment due within 30 days of the invoice date. The Seller will provide binding estimates prior to the commencement of work to ensure cost predictability for the Buyer."
  */

  let matchFound = false;

  for (let bestPractice of bestPractices) {
    const result = await outputFulfillsCriterion(
      replacementClause,
      "LLM output must be attributable to best practice described in additional context",
      bestPractice
    );
    matchFound = result.result;

    // We only care about finding one match. 
    // This will match on third best practice.
    if (matchFound) {
      break;
    }
  }

  expect(matchFound).toBe(true);
});
```

In this case the `result` output by `outputFulfillsCriterion` contains the JSON output generated by Poyro. If we log it we get the following:

```js
{
  "feedback": 'The response does not establish a structured dispute resolution framework, as it focuses on payment terms and estimates. The criterion is met: False',
  "result": false
}

{
  "feedback": 'The response does not explicitly mention comprehensive warranty coverage and support terms, which is a crucial aspect of securing the contract. The provided information focuses on payment terms and cost predictability. Therefore, the criterion is not met. False',
  "result": false
}

{
  "feedback": 'The response provides a clear plan for payment and cost predictability by outlining the timing of invoices, payment due dates, and providing binding estimates. This ensures financial clarity and planning accuracy regarding costs. True',
  "result": true
}
```

## Note on LLM-Based Testing

Poyro relies on a [local LLM](/how-does-it-work) to calculate results for `toFulfillCriterion` and `outputFulfillsCriterion`. This means that we have to iterate on our criterion (and additional context) to get results that align with human judgement.

To iterate, the best practice is determining the desired test outcome for a set of examples and then iterating on the criterion and additional context to have as many examples align with the expected outcome as possible. [This article](https://hamel.dev/blog/posts/evals/#automated-evaluation-w-llms) shows an example process for doing this that we aim to facilitate with Poyro in the future.

---

We hope that you found this article useful. We have found it helpful to walk through a comprehensive example of testing an AI app in the context of a single complex application, from brainstorming test ideas to actually implemeting them.

[Poyro](/) makes it easy to get started writing tests for your AI app in JavaScript with [Vitest](https://vitest.dev/guide/), adding plug-ins that make it simple to do LLM-based tests. If you are unsure of how to structure tests for your specific use case, you can always reach Daniel on [Twitter](https://x.com/danielbulhosa) or [Discord](https://discord.com/invite/gmCjjJ5jSf).

If you want to learn more about Outlit you can visit their [page](https://outlit.ai/) or reach Leo on his [Twitter](https://x.com/LeosReal).
