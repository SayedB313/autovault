"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, Car, LogOut, LayoutDashboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Search", href: "/search" },
  { label: "Luxury", href: "/luxury-car-storage" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();

  const isAuthed = status === "authenticated" && session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm supports-backdrop-filter:bg-white/80 dark:bg-background/95 dark:supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground"
        >
          <Car className="size-6 text-primary" />
          <span>AutoVault</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthed ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
              {session.user.image ? (
                <Link href="/dashboard">
                  <img
                    src={session.user.image}
                    alt=""
                    className="size-8 rounded-full border"
                  />
                </Link>
              ) : (
                <Link href="/dashboard">
                  <div className="size-8 rounded-full border bg-muted flex items-center justify-center">
                    <User className="size-4 text-muted-foreground" />
                  </div>
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-sm text-muted-foreground hover:text-foreground"
                title="Sign out"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign In
              </Link>
              <Button size="sm" render={<Link href="/auth/signin" />}>
                List Your Facility
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-bold"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Car className="size-5 text-primary" />
                    AutoVault
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="my-2 h-px bg-border" />

                {isAuthed ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted flex items-center gap-2"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        signOut();
                      }}
                      className="rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground text-left flex items-center gap-2"
                    >
                      <LogOut className="size-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      Sign In
                    </Link>
                    <Button
                      className="mt-2"
                      render={<Link href="/auth/signin" />}
                      onClick={() => setMobileOpen(false)}
                    >
                      List Your Facility
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
