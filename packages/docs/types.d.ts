import { type SearchOptions } from "flexsearch";

declare module "@/markdoc/search.js" {
  export interface Result {
    url: string;
    title: string;
    pageTitle?: string;
  }

  export function search(query: string, options?: SearchOptions): Result[];
}
