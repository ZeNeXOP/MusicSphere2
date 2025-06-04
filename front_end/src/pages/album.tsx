import React from "react";
import AppShell from "@components/layout/AppShell";
import { Card } from "@components/ui/Card";

const Album = () => {
  return (
    <AppShell>
      <div className="max-w-xl mx-auto w-full py-12">
        <Card className="p-8 bg-surface">
          <h1 className="text-2xl font-bold text-primary mb-4">Album View</h1>
          <p className="text-muted mb-2">
            Album details and tracks will appear here soon.
          </p>
        </Card>
      </div>
    </AppShell>
  );
};

export default Album;
