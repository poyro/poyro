"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { Hero } from "@/components/Hero";
// import { Logo, Logomark } from "@/components/Logo";
import { MobileNavigation } from "@/components/MobileNavigation";
import { Navigation } from "@/components/Navigation";
import { Search } from "@/components/Search";
import { ThemeSelector } from "@/components/ThemeSelector";
import { GitHubIcon } from "@/components/icons/GithubIcon";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 flex flex-none flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 sm:px-6 lg:px-8 dark:shadow-none",
        isScrolled
          ? "dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75"
          : "dark:bg-transparent"
      )}
    >
      <div className="mr-6 flex lg:hidden">
        <MobileNavigation />
      </div>
      <div className="relative flex flex-grow basis-0 items-center">
        <Link aria-label="Home page" href="/">
          <h1 className="font-display text-2xl font-semibold text-slate-900">
            Poyro
          </h1>
          {/* <Logomark className="h-9 w-9 lg:hidden" />
          <Logo className="hidden h-9 w-auto fill-slate-700 lg:block dark:fill-sky-100" /> */}
        </Link>
      </div>
      <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
        <Search />
      </div>
      <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow">
        <ThemeSelector className="relative z-10" />
        <Link
          aria-label="GitHub"
          className="group"
          href="https://github.com/poyro/poyro"
        >
          <GitHubIcon className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" />
        </Link>
      </div>
    </header>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="flex w-full flex-col">
      <Header />

      {isHomePage ? <Hero /> : null}

      <div className="relative mx-auto flex w-full max-w-8xl flex-auto justify-center sm:px-2 lg:px-8 xl:px-12">
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
          <div className="absolute bottom-0 right-0 top-16 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
          <div className="absolute bottom-0 right-0 top-28 hidden w-px bg-slate-800 dark:block" />
          <div className="sticky top-[4.75rem] -ml-0.5 h-[calc(100vh-4.75rem)] w-64 overflow-y-auto overflow-x-hidden py-16 pl-0.5 pr-8 xl:w-72 xl:pr-16">
            <Navigation />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
