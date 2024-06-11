import * as extensions from "./matchers";

type MatcherType<T> = T extends (
  // eslint-disable-next-line no-unused-vars
  instance: any,
  // eslint-disable-next-line no-unused-vars
  ...args: infer TArgs
) => infer TRet
  ? // eslint-disable-next-line no-unused-vars
    (...args: TArgs) => TRet
  : never;

declare global {
  // eslint-disable-next-line no-unused-vars
  namespace jest {
    // eslint-disable-next-line no-unused-vars
    interface Matchers<R> {
      toFulfillCriterion(): MatcherType<typeof extensions.toFulfillCriterion>;
    }
  }
}

// @ts-ignore
const jestExpect = global.expect as jest.Expect;

jestExpect.extend(extensions);

const expectPoyro = (<T>(actual: T) => {
  return jestExpect(actual);
}) as jest.Expect;

export { expectPoyro as expect };
