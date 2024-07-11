---
title: AI Testing as part of Full-Stack Engineering
---
**By**: [Daniel Bulhosa Solorzano](https://x.com/danielbulhosa)

The advent of ChatGPT and similar Model as a Service solutions has changed the landscape of full-stack engineering. Just as cloud services brought infrastructural knowledge into the realm of full-stack engineering, now Large Language Models (LLMs) have brought AI into the fold. This means that effective full-stack engineers working on AI products need to learn the best practices for building AI systems.


## Evaluation = Unit Testing

One of the critical tasks of AI development before ChatGPT was "evaluation". In a nutshell, you'd set some examples to the side of what data you wanted your AI to output. You would then compare your AI's actual output to this desired output. Engineers working on AI systems would use this signal to make improvements.

Does this sound familiar? It should, because:

- The evaluation step here is almost exactly the same as unit testing.
- The improvement step has become prompt engineering, retrieval-augmented generation (RAG), system design (e.g. chaining), and in rare cases fine-tuning.

Just like always, we need to write tests to make sure our system does what we want. This time however, we need to write tests not just with code but also with prompts.

## Unit Testing LLMs Using LLMs

There are many ways in which we can use regular code to write unit tests for AI outputs. For example, if you ask ChatGPT to generate a JSON response for your application you can check it obeys the schema you desire.

But what if the output is not "structured" in this way? What if we are generating an open ended response to a customer support query? Or, what if we are generating text for a new clause to add to a contract? 

Or what if the condition that we want to check is open ended? For example, what if we want to check that the output of our SEO-generation AI app "contains a call to action"? A call to action could look a lot of different ways.

These open ended questions and unstructured inputs are exactly what LLMs are good at dealing with. If Claude with one prompt generated our SEO text, Claude with another prompt can check if it contains a call to action.

## Bridging Testing for AI and Full-Stack Engineering

There are many great open source tools out there for testing LLM ouputs with other LLMs. However, some of the most popular tools are configuration driven or introduce new APIs, which makes it difficult to write your LLM-based unit tests alongside your regular unit tests. In addition, many of the most popular tools are Python first, despite [JavaScript being ranked as the most popular language by Stack Overflow 11 years in a row](https://survey.stackoverflow.co/2023/#most-popular-technologies-language-prof) and being popular amongst full-stack engineers.

There are also good SaaS solutions. However, these often have unnecessary UI components (e.g. you have to define your tests in a UI) which are awkward for the typical software engineering workflow. Many of these solutions only support LLM-based evaluation provided through a model vendor like ChatGPT or Claude. This means you can only unit test your app as much as your budget allows, an odd concept for an engineer.

This is exactly the set of problems that [Poyro](/) set out to solve:

- Poyro is written in JavaScript to be easily usable by JavaScript developers.
- Poyro doesn't introduce new APIs or configurations. You can write LLM-based unit tests in the syntax of Jest right alongside all your other tests. 
- Poyro does not include any unnecessary UI components. Your tests are written as code.
- Poyro tests using a small LLM that [runs locally on your computer](/how-does-it-work), so no fees to model providers.

In addition, we kept the [API simple](/sdk-reference), introducing only a single matcher to start rather than creating a bunch of new abstractions you have to learn.

---

Do you think that AI is becoming part of full-stack and web engineering? What's the best way to test AI in your web app? How tightly should AI tools be integrated with your stack? Tell us what you think in our [Discord](https://discord.com/invite/gmCjjJ5jSf) or [shoot me a tweet](https://x.com/danielbulhosa) with your thoughts!