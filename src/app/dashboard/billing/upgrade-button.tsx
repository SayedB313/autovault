"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function UpgradeButton({
  facilityId,
  tier,
  label = "Upgrade",
}: {
  facilityId: string;
  tier: "VERIFIED" | "PREMIUM";
  label?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facilityId, tier }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button size="sm" onClick={handleUpgrade} disabled={loading}>
      {loading ? "Loading..." : label}
    </Button>
  );
}

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);

  async function handleManage() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Failed to open billing portal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleManage} disabled={loading}>
      {loading ? "Loading..." : "Manage Billing"}
    </Button>
  );
}
