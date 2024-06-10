import type { MetaFunction, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/react";
import styles from "./styles.css";

export const meta: MetaFunction = () => [
  {
    charset: "utf-8",
    title: "Blog | Kitchen Sink",
    viewport: "width=device-width,initial-scale=1",
  },
];

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App(): JSX.Element {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}
