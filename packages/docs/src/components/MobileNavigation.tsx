"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Dialog, DialogPanel } from "@headlessui/react";

import { Logomark } from "@/components/Logo";
import { Navigation } from "@/components/Navigation";

function MenuIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      strokeLinecap="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M5 5l14 14M19 5l-14 14" />
    </svg>
  );
}

function CloseOnNavigation({ close }: { close: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    close();
  }, [pathname, searchParams, close]);

  return null;
}

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  function onLinkClick(event: React.MouseEvent<HTMLAnchorElement>) {
    const link = event.currentTarget;
    if (
      link.pathname + link.search + link.hash ===
      window.location.pathname + window.location.search + window.location.hash
    ) {
      close();
    }
  }

  return (
    <>
      <button
        aria-label="Open navigation"
        className="relative"
        onClick={() => {
          setIsOpen(true);
        }}
        type="button"
      >
        <MenuIcon className="h-6 w-6 stroke-slate-500" />
      </button>
      <Suspense fallback={null}>
        <CloseOnNavigation close={close} />
      </Suspense>
      <Dialog
        aria-label="Navigation"
        className="fixed inset-0 z-50 flex items-start overflow-y-auto bg-slate-900/50 pr-10 backdrop-blur lg:hidden"
        onClose={() => {
          close();
        }}
        open={isOpen}
      >
        <DialogPanel className="min-h-full w-full max-w-xs bg-white px-4 pb-12 pt-5 sm:px-6 dark:bg-slate-900">
          <div className="flex items-center">
            <button
              aria-label="Close navigation"
              onClick={() => {
                close();
              }}
              type="button"
            >
              <CloseIcon className="h-6 w-6 stroke-slate-500" />
            </button>
            <Link aria-label="Poyro docs home page" className="ml-6" href="/">
              {/* <Logomark className="h-9 w-9" /> */}
              <h1 className="font-display text-2xl font-semibold text-slate-900">
                Poyro
              </h1>
            </Link>
          </div>
          <Navigation className="mt-5 px-1" onLinkClick={onLinkClick} />
        </DialogPanel>
      </Dialog>
    </>
  );
}
