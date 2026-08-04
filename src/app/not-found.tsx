import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-5">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-muted-foreground">404</span>
        </div>
        <h1 className="text-xl font-bold text-foreground mb-2">
          Page not found
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="block w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
