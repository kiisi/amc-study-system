import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type AppLoadContext,
} from "react-router";
import { ProgressProvider } from '@bprogress/react';

import type { Route } from "./+types/root";
import "./app.css";
import { rootContext } from "./contexts";
import { Toaster } from "react-hot-toast";
import { useNavigation } from "react-router";
import { useEffect } from "react";
import { BProgress } from "@bprogress/core";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

BProgress.configure({
  minimum: 0.08,
  maximum: 1,
  template: `<div class="bar" style="display: none">
              <div class="peg">
              </div>
             </div>
             <div class="spinner"><div class="spinner-icon"></div></div>
             <div class="indeterminate"><div class="inc"></div><div class="dec"></div></div>`,
  easing: 'linear',
  positionUsing: 'width',
  speed: 200,
  trickle: true,
  trickleSpeed: 200,
  showSpinner: true,
  indeterminate: false,
  indeterminateSelector: '.indeterminate',
  barSelector: '.bar',
  spinnerSelector: '.spinner',
  parent: 'body',
  direction: 'ltr',
});

export function Layout({ children }: { children: React.ReactNode }) {
  let navigation = useNavigation();

  if (navigation.state === "loading") {
    BProgress.start();
  } else {
    BProgress.done();
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ProgressProvider>
          {children}
          <ScrollRestoration />
          <Scripts />
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 2500,
            }}
          />
        </ProgressProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full bg-[#f4f5f6] p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}


async function timingMiddleware({ context }, next) {

  console.log(`Navigating ...`);
  return next();
}

export const middleware: Route.ClientMiddlewareFunction[] =
  [timingMiddleware];