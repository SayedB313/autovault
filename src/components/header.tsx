"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, LogOut, LayoutDashboard, User } from "lucide-react";
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
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  const isAuthed = status === "authenticated" && session?.user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl font-light tracking-[0.2em] uppercase text-foreground transition-colors hover:text-primary"
        >
          AutoVault
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-lg px-4 py-2 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {isAuthed ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                <LayoutDashboard className="size-4" />
                Dashboard
              </Link>
              {session.user.image ? (
                <Link href="/dashboard">
                  <img
                    src={session.user.image}
                    alt=""
                    className="size-8 rounded-full ring-1 ring-border"
                  />
                </Link>
              ) : (
                <Link href="/dashboard">
                  <div className="size-8 rounded-full ring-1 ring-border bg-muted flex items-center justify-center">
                    <User className="size-4 text-muted-foreground" />
                  </div>
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-sm text-foreground/40 hover:text-foreground transition-colors"
                title="Sign out"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                Sign In
              </Link>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                render={<Link href="/auth/signin" />}
              >
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
                <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground">
                  <Menu className="size-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />
            <SheetContent side="right" className="bg-background border-border">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    className="font-serif text-lg font-light tracking-[0.2em] uppercase text-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
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
                    className="rounded-lg px-3 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="my-3 h-px bg-border" />

                {isAuthed ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-3 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-muted flex items-center gap-2"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        signOut();
                      }}
                      className="rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground text-left flex items-center gap-2"
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
                      className="rounded-lg px-3 py-3 text-base font-medium text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      Sign In
                    </Link>
                    <Button
                      className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90"
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
