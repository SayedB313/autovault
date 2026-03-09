"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

interface ContactFacilityFormProps {
  facilityId: string;
}

const VEHICLE_TYPES = [
  { value: "CAR", label: "Car" },
  { value: "MOTORCYCLE", label: "Motorcycle" },
  { value: "RV", label: "RV" },
  { value: "BOAT", label: "Boat" },
  { value: "CLASSIC", label: "Classic Car" },
  { value: "EXOTIC", label: "Exotic Car" },
  { value: "TRUCK", label: "Truck" },
  { value: "TRAILER", label: "Trailer" },
];

export function ContactFacilityForm({ facilityId }: ContactFacilityFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      facilityId,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      message: (formData.get("message") as string) || undefined,
      vehicleType: (formData.get("vehicleType") as string) || undefined,
    };

    if (!data.name || !data.email) {
      setStatus("error");
      setErrorMessage("Name and email are required.");
      return;
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to send message");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <h4 className="font-semibold text-foreground">Message Sent!</h4>
        <p className="text-sm text-muted-foreground">
          The facility will receive your inquiry and get back to you soon.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStatus("idle")}
          className="mt-2"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contact-name">Name *</Label>
        <Input
          id="contact-name"
          name="name"
          required
          placeholder="Your full name"
          className="h-9"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-email">Email *</Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="h-9"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-phone">Phone</Label>
        <Input
          id="contact-phone"
          name="phone"
          type="tel"
          placeholder="(555) 123-4567"
          className="h-9"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-vehicle">Vehicle Type</Label>
        <select
          id="contact-vehicle"
          name="vehicleType"
          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Select a type</option>
          {VEHICLE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          name="message"
          placeholder="Tell us about your storage needs..."
          rows={4}
        />
      </div>

      {status === "error" && errorMessage && (
        <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
