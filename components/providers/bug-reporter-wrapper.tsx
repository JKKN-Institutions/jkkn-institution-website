'use client';

// Bug reporter SDK removed (supply chain risk — private unpublished package).
// This wrapper is kept as a passthrough so the provider tree in providers.tsx
// requires no structural changes.

export function BugReporterWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
