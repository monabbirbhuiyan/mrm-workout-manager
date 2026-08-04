"use client";

export default function RoutineError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-5">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">!</span>
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">
          Failed to load routines
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {error.message || "An error occurred while loading your routines."}
        </p>
        <button
          onClick={reset}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
