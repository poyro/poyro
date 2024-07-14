"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

import type { Subsubsection, Section, Subsection } from "@/lib/sections";
import { GitHubIcon } from "@/components/icons/GithubIcon";

export function TableOfContents({
  tableOfContents,
}: {
  tableOfContents: Section[];
}): React.ReactElement {
  const pathname = usePathname();

  const [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id);

  const getHeadings = useCallback((tableOfContents: Section[]) => {
    return tableOfContents
      .flatMap((node) => [
        node.id,
        ...node.children.map((child) => child.id),
        ...node.children.flatMap(
          (child) => child.children?.map((subChild) => subChild.id) ?? []
        ),
      ])
      .map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;

        const style = window.getComputedStyle(el);
        const scrollMt = parseFloat(style.scrollMarginTop);

        const top = window.scrollY + el.getBoundingClientRect().top - scrollMt;
        return { id, top };
      })
      .filter((x): x is { id: string; top: number } => x !== null)
      .sort((a, b) => a.top - b.top);
  }, []);

  useEffect(() => {
    if (tableOfContents.length === 0) return;
    const headings = getHeadings(tableOfContents);
    function onScroll() {
      const top = window.scrollY;
      let current = headings[0].id;
      for (const heading of headings) {
        if (top >= heading.top - 10) {
          current = heading.id;
        } else {
          break;
        }
      }
      setCurrentSection(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [getHeadings, tableOfContents]);

  const isActive = (section: Section | Subsection | Subsubsection): boolean => {
    if (section.id === currentSection) {
      return true;
    }
    if (!section.children) {
      return false;
    }
    return section.children.findIndex(isActive) > -1;
  };

  const githubEditUrl = useMemo(() => {
    const root =
      "https://github.com/poyro/poyro/edit/main/packages/docs/src/app";

    if (pathname === "/") {
      return `${root}/page.md`;
    }

    return `root${pathname}/page.md`;
  }, [pathname]);

  return (
    <div className="hidden xl:sticky xl:top-[4.75rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
      <nav aria-labelledby="on-this-page-title" className="w-56">
        {tableOfContents.length > 0 && (
          <>
            <h2
              className="font-display text-sm font-medium text-slate-900 dark:text-white"
              id="on-this-page-title"
            >
              On this page
            </h2>
            <ol className="mt-4 space-y-3 text-sm">
              {tableOfContents.map((section) => (
                <li key={section.id}>
                  <h3>
                    <Link
                      className={clsx(
                        isActive(section)
                          ? "text-sky-500"
                          : "font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      )}
                      href={`#${section.id}`}
                    >
                      {section.title}
                    </Link>
                  </h3>
                  {section.children.length > 0 && (
                    <ol className="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400">
                      {section.children.map((subSection) => (
                        <li key={subSection.id}>
                          <Link
                            className={
                              isActive(subSection)
                                ? "text-sky-500"
                                : "hover:text-slate-600 dark:hover:text-slate-300"
                            }
                            href={`#${subSection.id}`}
                          >
                            {subSection.title}
                          </Link>
                          {subSection.children?.length ? (
                            <ol className="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400">
                              {subSection.children.map((subSubSection) => (
                                <li key={subSubSection.id}>
                                  <Link
                                    className={
                                      isActive(subSubSection)
                                        ? "text-sky-500"
                                        : "hover:text-slate-600 dark:hover:text-slate-300"
                                    }
                                    href={`#${subSubSection.id}`}
                                  >
                                    {subSubSection.title}
                                  </Link>
                                </li>
                              ))}
                            </ol>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ol>
          </>
        )}

        <Link
          aria-label="Edit this page on GitHub"
          className="group inline-flex mt-8 items-center gap-2"
          href={githubEditUrl}
        >
          <GitHubIcon className="h-3 w-3 fill-slate-500 group-hover:fill-slate-700 dark:fill-slate-400 dark:hover:fill-slate-300" />
          <span className="text-xs text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
            Edit this page on GitHub
          </span>
        </Link>
      </nav>
    </div>
  );
}
