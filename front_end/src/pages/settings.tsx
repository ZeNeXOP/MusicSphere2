import React from "react";
import AppShell from "@components/layout/AppShell";
import { Card } from "@components/ui/Card";

const Settings = () => {
  return (
    <AppShell>
      <div className="max-w-xl mx-auto w-full py-12">
        <Card className="p-8 bg-surface">
          <h1 className="text-2xl font-bold text-primary mb-4">Settings</h1>
          <p className="text-muted mb-2">
            User settings and preferences will appear here soon.
          </p>
        </Card>
      </div>
    </AppShell>
  );
};

export default Settings;
