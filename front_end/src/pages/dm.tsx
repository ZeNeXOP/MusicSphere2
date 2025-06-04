import React from "react";
import AppShell from "@components/layout/AppShell";
import { Card } from "@components/ui/Card";

const DM = () => {
  return (
    <AppShell>
      <div className="max-w-xl mx-auto w-full py-12">
        <Card className="p-8 bg-surface">
          <h1 className="text-2xl font-bold text-primary mb-4">
            Direct Messages
          </h1>
          <p className="text-muted mb-2">
            Your conversations will appear here soon.
          </p>
        </Card>
      </div>
    </AppShell>
  );
};

export default DM;
