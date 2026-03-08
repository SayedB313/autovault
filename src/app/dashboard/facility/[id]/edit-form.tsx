"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const ALL_STORAGE_TYPES = ["INDOOR", "OUTDOOR", "COVERED", "CLIMATE_CONTROLLED", "ENCLOSED"];
const ALL_VEHICLE_TYPES = ["CAR", "MOTORCYCLE", "RV", "BOAT", "CLASSIC", "EXOTIC", "TRUCK", "TRAILER"];
const ALL_AMENITIES = [
  "ACCESS_24HR", "SECURITY_CAMERAS", "GATED", "ALARM_SYSTEM", "FIRE_SUPPRESSION",
  "EV_CHARGING", "CONCIERGE", "DETAILING", "MAINTENANCE", "TRANSPORT",
  "INSURANCE", "CLIMATE_MONITORING", "WIFI", "LOUNGE", "CAR_WASH", "BATTERY_TENDER",
];

function formatLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface FacilityData {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  storageTypes: string[];
  vehicleTypes: string[];
  amenities: string[];
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  pricePer: string;
}

export default function EditForm({ facility }: { facility: FacilityData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [storageTypes, setStorageTypes] = useState<string[]>(facility.storageTypes);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>(facility.vehicleTypes);
  const [amenities, setAmenities] = useState<string[]>(facility.amenities);

  function toggleItem(arr: string[], item: string, setter: (v: string[]) => void) {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/facilities/${facility.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          description: fd.get("description"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          website: fd.get("website"),
          priceRangeMin: fd.get("priceRangeMin") ? Number(fd.get("priceRangeMin")) : null,
          priceRangeMax: fd.get("priceRangeMax") ? Number(fd.get("priceRangeMax")) : null,
          pricePer: fd.get("pricePer"),
          storageTypes,
          vehicleTypes,
          amenities,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setMessage("Changes saved!");
      router.refresh();
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Error saving");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Facility Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Facility Name</Label>
              <Input id="name" name="name" defaultValue={facility.name} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={facility.phone || ""} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={facility.email || ""} />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" type="url" defaultValue={facility.website || ""} />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={facility.description || ""}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="priceRangeMin">Min Price ($)</Label>
              <Input
                id="priceRangeMin"
                name="priceRangeMin"
                type="number"
                min={0}
                defaultValue={facility.priceRangeMin || ""}
              />
            </div>
            <div>
              <Label htmlFor="priceRangeMax">Max Price ($)</Label>
              <Input
                id="priceRangeMax"
                name="priceRangeMax"
                type="number"
                min={0}
                defaultValue={facility.priceRangeMax || ""}
              />
            </div>
            <div>
              <Label htmlFor="pricePer">Price Per</Label>
              <select
                id="pricePer"
                name="pricePer"
                defaultValue={facility.pricePer}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="MONTH">Month</option>
                <option value="DAY">Day</option>
                <option value="WEEK">Week</option>
                <option value="YEAR">Year</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Storage Types</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ALL_STORAGE_TYPES.map((t) => (
                <Badge
                  key={t}
                  variant={storageTypes.includes(t) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleItem(storageTypes, t, setStorageTypes)}
                >
                  {formatLabel(t)}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Vehicle Types</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ALL_VEHICLE_TYPES.map((t) => (
                <Badge
                  key={t}
                  variant={vehicleTypes.includes(t) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleItem(vehicleTypes, t, setVehicleTypes)}
                >
                  {formatLabel(t)}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Amenities</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ALL_AMENITIES.map((a) => (
                <Badge
                  key={a}
                  variant={amenities.includes(a) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleItem(amenities, a, setAmenities)}
                >
                  {formatLabel(a)}
                </Badge>
              ))}
            </div>
          </div>

          {message && (
            <p className={`text-sm px-3 py-2 rounded ${message.includes("saved") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message}
            </p>
          )}

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
