'use client';

import { MyBugsPanel } from '@boobalan_jkkn/bug-reporter-sdk';

export default function MyBugsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Bug Reports</h1>
        <p className="text-muted-foreground mt-1">
          View and track the bug reports you have submitted
        </p>
      </div>
      <MyBugsPanel />
    </div>
  );
}
