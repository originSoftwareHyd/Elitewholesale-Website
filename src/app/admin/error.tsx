"use client";

import { useEffect } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";

// Next.js Server Actions are tied to the exact build that created them. If an admin page was
// left open across a deploy, the browser still holds the *old* build's action IDs, and the
// *new* server no longer recognizes them - every Save/Delete then fails with this specific
// error (seen in production logs as "Failed to find Server Action" / "Server Reference ID did
// not match the expected format"). A plain reset() just re-renders the same stale page, so it
// doesn't help; a full reload fetches the new build and fixes it immediately.
function isStaleDeploymentError(error: Error): boolean {
  return /Server Reference|Server Action/i.test(error.message);
}

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  const stale = isStaleDeploymentError(error);

  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="glass w-full max-w-md rounded-2xl p-8 text-center">
        <TriangleAlert className="mx-auto size-12 text-primary" />
        <h1 className="mt-5 text-2xl font-black">
          {stale ? "This page is out of date" : "Something went wrong"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {stale
            ? "The site was updated while this page was open, so your last action didn't go through. Refresh the page and try again - nothing was lost."
            : "This admin page hit an unexpected error. Try again, or refresh the page."}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            <RefreshCw className="size-4" />
            Refresh page
          </button>
          {!stale && (
            <button type="button" onClick={reset} className="btn btn-secondary">
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
