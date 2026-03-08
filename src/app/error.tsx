"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="mt-4 text-muted-foreground max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset} className="mt-8">
        Try Again
      </Button>
    </div>
  );
}
