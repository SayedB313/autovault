"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchBarProps = {
  /** Pre-fill with an existing query */
  defaultValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Additional classes for the outer wrapper */
  className?: string;
};

export function SearchBar({
  defaultValue = "",
  placeholder = "Search by city, state, or facility name...",
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      router.push("/search");
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full items-center gap-2 rounded-xl bg-white p-1.5 shadow-md ring-1 ring-foreground/10 dark:bg-card ${className ?? ""}`}
    >
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="border-0 pl-9 shadow-none focus-visible:ring-0"
          aria-label="Search facilities"
        />
      </div>
      <Button type="submit" size="lg" className="shrink-0 px-6">
        Search
      </Button>
    </form>
  );
}
