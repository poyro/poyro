"use client";

import { Fragment } from "react";
import { Highlight } from "prism-react-renderer";
import clsx from "clsx";

export function Fence({
  children,
  language,
}: {
  children: string;
  language: string;
}) {
  return (
    <Highlight
      code={children.trimEnd()}
      language={language}
      theme={{ plain: {}, styles: [] }}
    >
      {({ className, style, tokens, getTokenProps }) => (
        <pre
          className={clsx(className, "whitespace-break-spaces")}
          style={style}
        >
          <code>
            {tokens.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {line
                  .filter((token) => !token.empty)
                  .map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({ token })} />
                  ))}
                {"\n"}
              </Fragment>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
