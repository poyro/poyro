import { type Node } from "@markdoc/markdoc";
import { slugifyWithCounter } from "@sindresorhus/slugify";

interface HeadingNode extends Node {
  type: "heading";
  attributes: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    id?: string;
    [key: string]: unknown;
  };
}

type H2Node = HeadingNode & {
  attributes: {
    level: 2;
  };
};

type H3Node = HeadingNode & {
  attributes: {
    level: 3;
  };
};

type H4Node = HeadingNode & {
  attributes: {
    level: 4;
  };
};

function isHeadingNode(node: Node): node is HeadingNode {
  return (
    node.type === "heading" &&
    [1, 2, 3, 4, 5, 6].includes(node.attributes.level) &&
    (typeof node.attributes.id === "string" ||
      typeof node.attributes.id === "undefined")
  );
}

function isH2Node(node: Node): node is H2Node {
  return isHeadingNode(node) && node.attributes.level === 2;
}

function isH3Node(node: Node): node is H3Node {
  return isHeadingNode(node) && node.attributes.level === 3;
}

function isH4Node(node: Node): node is H4Node {
  return isHeadingNode(node) && node.attributes.level === 4;
}

function getNodeText(node: Node) {
  let text = "";
  for (const child of node.children ?? []) {
    if (child.type === "text") {
      text += child.attributes.content;
    }
    text += getNodeText(child);
  }
  return text;
}

export type Subsubsection = H4Node["attributes"] & {
  id: string;
  title: string;
  children?: undefined;
};

export type Subsection = H3Node["attributes"] & {
  id: string;
  title: string;
  children?: Subsubsection[];
};

export type Section = H2Node["attributes"] & {
  id: string;
  title: string;
  children: Subsection[];
};

export function collectSections(nodes: Node[], slugify = slugifyWithCounter()) {
  const sections: Section[] = [];

  for (const node of nodes) {
    if (isH2Node(node) || isH3Node(node) || isH4Node(node)) {
      const title = getNodeText(node);
      if (title) {
        const id = slugify(title);
        if (isH3Node(node)) {
          if (!sections[sections.length - 1]) {
            throw new Error(
              "Cannot add `h3` to table of contents without a preceding `h2`"
            );
          }
          sections[sections.length - 1].children.push({
            ...node.attributes,
            id,
            title,
          });
        } else if (isH4Node(node)) {
          if (
            !sections[sections.length - 1]?.children.some(
              (value) => value.level === 3
            )
          ) {
            throw new Error(
              "Cannot add `h4` to table of contents without a preceding `h3`"
            );
          }

          const subsection =
            sections[sections.length - 1].children[
              sections[sections.length - 1].children.length - 1
            ];

          if (subsection.children === undefined) {
            subsection.children = [];
          }

          subsection.children.push({ ...node.attributes, id, title });
        } else {
          sections.push({ ...node.attributes, id, title, children: [] });
        }
      }
    }

    sections.push(...collectSections(node.children ?? [], slugify));
  }

  return sections;
}
