"use client";

import {
  forwardRef,
  Fragment,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Highlighter from "react-highlight-words";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type AutocompleteApi,
  type AutocompleteCollection,
  type AutocompleteState,
  createAutocomplete,
} from "@algolia/autocomplete-core";
import { Dialog, DialogPanel } from "@headlessui/react";
import clsx from "clsx";

import { navigation } from "@/lib/navigation";
import { type Result } from "@/markdoc/search.js";

type EmptyObject = Record<string, never>;

type Autocomplete = AutocompleteApi<
  Result,
  React.SyntheticEvent,
  React.MouseEvent,
  React.KeyboardEvent
>;

function SearchIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" {...props}>
      <path d="M16.293 17.707a1 1 0 0 0 1.414-1.414l-1.414 1.414ZM9 14a5 5 0 0 1-5-5H2a7 7 0 0 0 7 7v-2ZM4 9a5 5 0 0 1 5-5V2a7 7 0 0 0-7 7h2Zm5-5a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7v2Zm8.707 12.293-3.757-3.757-1.414 1.414 3.757 3.757 1.414-1.414ZM14 9a4.98 4.98 0 0 1-1.464 3.536l1.414 1.414A6.98 6.98 0 0 0 16 9h-2Zm-1.464 3.536A4.98 4.98 0 0 1 9 14v2a6.98 6.98 0 0 0 4.95-2.05l-1.414-1.414Z" />
    </svg>
  );
}

function useAutocomplete({
  close,
}: {
  close: (autocomplete: Autocomplete) => void;
}) {
  const id = useId();
  const router = useRouter();
  const [autocompleteState, setAutocompleteState] = useState<
    AutocompleteState<Result> | EmptyObject
  >({});

  function navigate({ itemUrl }: { itemUrl?: string }) {
    if (!itemUrl) {
      return;
    }

    router.push(itemUrl);

    if (
      itemUrl ===
      window.location.pathname + window.location.search + window.location.hash
    ) {
      close(autocomplete);
    }
  }

  const [autocomplete] = useState<Autocomplete>(() =>
    createAutocomplete<
      Result,
      React.SyntheticEvent,
      React.MouseEvent,
      React.KeyboardEvent
    >({
      id,
      placeholder: "Find something...",
      defaultActiveItemId: 0,
      onStateChange({ state }) {
        setAutocompleteState(state);
      },
      shouldPanelOpen({ state }) {
        return state.query !== "";
      },
      navigator: {
        navigate,
      },
      getSources({ query }) {
        return import("@/markdoc/search.js").then(({ search }) => {
          return [
            {
              sourceId: "documentation",
              getItems() {
                return search(query, { limit: 5 });
              },
              getItemUrl({ item }) {
                return item.url;
              },
              onSelect: navigate,
            },
          ];
        });
      },
    })
  );

  return { autocomplete, autocompleteState };
}

function LoadingIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  const id = useId();

  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20" {...props}>
      <circle cx="10" cy="10" r="5.5" strokeLinejoin="round" />
      <path
        d="M15.5 10a5.5 5.5 0 1 0-5.5 5.5"
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id={id}
          x1="13"
          x2="9.5"
          y1="9"
          y2="15"
        >
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function HighlightQuery({ text, query }: { text: string; query: string }) {
  return (
    <Highlighter
      autoEscape
      highlightClassName="group-aria-selected:underline bg-transparent text-sky-600 dark:text-sky-400"
      searchWords={[query]}
      textToHighlight={text}
    />
  );
}

function SearchResult({
  result,
  autocomplete,
  collection,
  query,
}: {
  result: Result;
  autocomplete: Autocomplete;
  collection: AutocompleteCollection<Result>;
  query: string;
}) {
  const id = useId();

  const sectionTitle = navigation.find((section) =>
    section.links.find((link) => link.href === result.url.split("#")[0])
  )?.title;
  const hierarchy = [sectionTitle, result.pageTitle].filter(
    (x): x is string => typeof x === "string"
  );

  return (
    <li
      aria-labelledby={`${id}-hierarchy ${id}-title`}
      className="group block cursor-default rounded-lg px-3 py-2 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-700/30"
      {...autocomplete.getItemProps({
        item: result,
        source: collection.source,
      })}
    >
      <div
        aria-hidden="true"
        className="text-sm text-slate-700 group-aria-selected:text-sky-600 dark:text-slate-300 dark:group-aria-selected:text-sky-400"
        id={`${id}-title`}
      >
        <HighlightQuery query={query} text={result.title} />
      </div>
      {hierarchy.length > 0 && (
        <div
          aria-hidden="true"
          className="mt-0.5 truncate whitespace-nowrap text-xs text-slate-500 dark:text-slate-400"
          id={`${id}-hierarchy`}
        >
          {hierarchy.map((item, itemIndex, items) => (
            <Fragment key={itemIndex}>
              <HighlightQuery query={query} text={item} />
              <span
                className={
                  itemIndex === items.length - 1
                    ? "sr-only"
                    : "mx-2 text-slate-300 dark:text-slate-700"
                }
              >
                /
              </span>
            </Fragment>
          ))}
        </div>
      )}
    </li>
  );
}

function SearchResults({
  autocomplete,
  query,
  collection,
}: {
  autocomplete: Autocomplete;
  query: string;
  collection: AutocompleteCollection<Result>;
}) {
  if (collection.items.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-slate-700 dark:text-slate-400">
        No results for &ldquo;
        <span className="break-words text-slate-900 dark:text-white">
          {query}
        </span>
        &rdquo;
      </p>
    );
  }

  return (
    <ul {...autocomplete.getListProps()}>
      {collection.items.map((result) => (
        <SearchResult
          autocomplete={autocomplete}
          collection={collection}
          key={result.url}
          query={query}
          result={result}
        />
      ))}
    </ul>
  );
}

const SearchInput = forwardRef<
  React.ElementRef<"input">,
  {
    autocomplete: Autocomplete;
    autocompleteState: AutocompleteState<Result> | EmptyObject;
    onClose: () => void;
  }
>(function SearchInput({ autocomplete, autocompleteState, onClose }, inputRef) {
  const inputProps = autocomplete.getInputProps({ inputElement: null });

  return (
    <div className="group relative flex h-12">
      <SearchIcon className="pointer-events-none absolute left-4 top-0 h-full w-5 fill-slate-400 dark:fill-slate-500" />
      <input
        className={clsx(
          "flex-auto appearance-none bg-transparent pl-12 text-slate-900 outline-none placeholder:text-slate-400 focus:w-full focus:flex-none sm:text-sm dark:text-white [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-webkit-search-results-button]:hidden [&::-webkit-search-results-decoration]:hidden",
          autocompleteState.status === "stalled" ? "pr-11" : "pr-4"
        )}
        data-autofocus
        ref={inputRef}
        {...inputProps}
        onKeyDown={(event) => {
          if (
            event.key === "Escape" &&
            !autocompleteState.isOpen &&
            autocompleteState.query === ""
          ) {
            // In Safari, closing the dialog with the escape key can sometimes cause the scroll position to jump to the
            // bottom of the page. This is a workaround for that until we can figure out a proper fix in Headless UI.
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }

            onClose();
          } else {
            inputProps.onKeyDown(event);
          }
        }}
      />
      {autocompleteState.status === "stalled" && (
        <div className="absolute inset-y-0 right-3 flex items-center">
          <LoadingIcon className="h-6 w-6 animate-spin stroke-slate-200 text-slate-400 dark:stroke-slate-700 dark:text-slate-500" />
        </div>
      )}
    </div>
  );
});

function CloseOnNavigation({
  close,
  autocomplete,
}: {
  close: (autocomplete: Autocomplete) => void;
  autocomplete: Autocomplete;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    close(autocomplete);
  }, [pathname, searchParams, close, autocomplete]);

  return null;
}

function SearchDialog({
  open,
  setOpen,
  className,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
}) {
  const formRef = useRef<React.ElementRef<"form">>(null);
  const panelRef = useRef<React.ElementRef<"div">>(null);
  const inputRef = useRef<React.ElementRef<typeof SearchInput>>(null);

  const close = useCallback(
    (autocomplete: Autocomplete) => {
      setOpen(false);
      autocomplete.setQuery("");
    },
    [setOpen]
  );

  const { autocomplete, autocompleteState } = useAutocomplete({
    close() {
      close(autocomplete);
    },
  });

  useEffect(() => {
    if (open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  return (
    <>
      <Suspense fallback={null}>
        <CloseOnNavigation autocomplete={autocomplete} close={close} />
      </Suspense>
      <Dialog
        className={clsx("fixed inset-0 z-50", className)}
        onClose={() => {
          close(autocomplete);
        }}
        open={open}
      >
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur" />

        <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
          <DialogPanel className="mx-auto transform-gpu overflow-hidden rounded-xl bg-white shadow-xl sm:max-w-xl dark:bg-slate-800 dark:ring-1 dark:ring-slate-700">
            <div {...autocomplete.getRootProps({})}>
              <form
                ref={formRef}
                {...autocomplete.getFormProps({
                  inputElement: inputRef.current,
                })}
              >
                <SearchInput
                  autocomplete={autocomplete}
                  autocompleteState={autocompleteState}
                  onClose={() => {
                    setOpen(false);
                  }}
                  ref={inputRef}
                />
                <div
                  className="border-t border-slate-200 bg-white px-2 py-3 empty:hidden dark:border-slate-400/10 dark:bg-slate-800"
                  ref={panelRef}
                  {...autocomplete.getPanelProps({})}
                >
                  {autocompleteState.isOpen ? (
                    <SearchResults
                      autocomplete={autocomplete}
                      collection={autocompleteState.collections[0]}
                      query={autocompleteState.query}
                    />
                  ) : null}
                </div>
              </form>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

function useSearchProps() {
  const buttonRef = useRef<React.ElementRef<"button">>(null);
  const [open, setOpen] = useState(false);

  return {
    buttonProps: {
      ref: buttonRef,
      onClick() {
        setOpen(true);
      },
    },
    dialogProps: {
      open,
      setOpen: useCallback((open: boolean) => {
        const { width = 0, height = 0 } =
          buttonRef.current?.getBoundingClientRect() ?? {};
        if (!open || (width !== 0 && height !== 0)) {
          setOpen(open);
        }
      }, []),
    },
  };
}

export function Search() {
  const [modifierKey, setModifierKey] = useState<string>();
  const { buttonProps, dialogProps } = useSearchProps();

  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? "⌘" : "Ctrl "
    );
  }, []);

  return (
    <>
      <button
        className="group flex h-6 w-6 items-center justify-center sm:justify-start md:h-auto md:w-80 md:flex-none md:rounded-lg md:py-2.5 md:pl-4 md:pr-3.5 md:text-sm md:ring-1 md:ring-slate-200 md:hover:ring-slate-300 lg:w-96 dark:md:bg-slate-800/75 dark:md:ring-inset dark:md:ring-white/5 dark:md:hover:bg-slate-700/40 dark:md:hover:ring-slate-500"
        type="button"
        {...buttonProps}
      >
        <SearchIcon className="h-5 w-5 flex-none fill-slate-400 group-hover:fill-slate-500 md:group-hover:fill-slate-400 dark:fill-slate-500" />
        <span className="sr-only md:not-sr-only md:ml-2 md:text-slate-500 md:dark:text-slate-400">
          Search docs
        </span>
        {modifierKey ? (
          <kbd className="ml-auto hidden font-medium text-slate-400 md:block dark:text-slate-500">
            <kbd className="font-sans">{modifierKey}</kbd>
            <kbd className="font-sans">K</kbd>
          </kbd>
        ) : null}
      </button>
      <SearchDialog {...dialogProps} />
    </>
  );
}
