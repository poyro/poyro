import type { BaseItem } from "@algolia/autocomplete-core";
import { type SearchOptions } from "flexsearch";

declare module "@/markdoc/search.js" {
  export interface Result extends BaseItem {
    url: string;
    title: string;
    pageTitle?: string;
  }

  export function search(query: string, options?: SearchOptions): Result[];
}
