export interface FeedbackObject {
  /** The feedback message */
  feedback: string;
  /** The result of the comparison */
  result: boolean;
}

export type OutputFulfillsCriterionArgs = (
  /** The output from the LLM to test */
  llmOutput: string,
  /** The criterion to test against */
  criterion: string,
  /** Additional context to include in the prompt */
  additionalContext?: string
) => Promise<FeedbackObject>;

export type RunpodCallStatus =
  | "COMPLETED"
  | "IN_PROGRESS"
  | "IN_QUEUE"
  | "FAILED"
  | "CANCELLED"
  | "TIMED_OUT";

export interface RunpodResponse {
  delayTime: number;
  executionTime: number;
  id: string;
  output: {
    choices: {
      finish_reason: string;
      index: number;
      logprobs: null;
      message: {
        content: string;
        role: string;
      };
    }[];
    created: number;
    id: string;
    model: string;
    usage: {
      completion_tokens: number;
      prompt_tokens: number;
      total_tokens: number;
    };
  };
  status: RunpodCallStatus;
}
