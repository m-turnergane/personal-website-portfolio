"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { X, Check, Mail, Loader2 } from "lucide-react";
import { SUBSCRIBE_CATEGORIES } from "@/lib/categories";

const STORAGE_KEY = "mg-subscribe-dismissed";
const DISMISS_DAYS = 30;

type ModalState = "idle" | "loading" | "success" | "already" | "error";

export function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [state, setState] = useState<ModalState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  const close = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  }, []);

  // Auto-show: 8s delay, only on non-homepage, only if not recently dismissed
  useEffect(() => {
    if (isHomepage) return;

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      const daysSince =
        (Date.now() - parseInt(dismissed, 10)) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_DAYS) return;
    }

    const timer = setTimeout(() => setIsOpen(true), 8000);
    return () => clearTimeout(timer);
  }, [isHomepage]);

  // Manual trigger via custom event (from footer link, etc.)
  useEffect(() => {
    const handler = () => {
      setState("idle");
      setEmail("");
      setSelectedCategories([]);
      setErrorMessage("");
      setIsOpen(true);
    };
    window.addEventListener("open-subscribe-modal", handler);
    return () => window.removeEventListener("open-subscribe-modal", handler);
  }, []);

  // Clean ?subscribed= query param after confirmation redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("subscribed")) {
      window.history.replaceState({}, "", pathname);
    }
  }, [pathname]);

  // Body scroll lock + focus input
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => emailInputRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || selectedCategories.length === 0) return;

    setState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, categories: selectedCategories }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setErrorMessage(data.error || "Something went wrong.");
        return;
      }

      if (data.message === "already_subscribed") {
        setState("already");
      } else {
        setState("success");
      }

      setTimeout(() => {
        close();
        setTimeout(() => {
          setState("idle");
          setEmail("");
          setSelectedCategories([]);
        }, 300);
      }, 4000);
    } catch {
      setState("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <>
      <div
        className={`subscribe-backdrop ${isOpen ? "open" : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        className={`subscribe-modal ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Subscribe to updates"
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {state === "success" || state === "already" ? (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-heading text-xl font-semibold text-white mb-2">
              {state === "already"
                ? "You're already subscribed"
                : "Check your inbox"}
            </h2>
            <p className="text-sm text-zinc-400">
              {state === "already"
                ? "We'll keep you posted on new work."
                : "Click the confirmation link to activate your subscription."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-zinc-400" />
              </div>
              <h2 className="font-heading text-xl font-semibold text-white">
                Stay in the loop
              </h2>
            </div>

            <p className="text-sm text-zinc-400 mb-5">
              Get notified when I publish new work — no spam, just signal.
            </p>

            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full mb-4 text-sm"
              disabled={state === "loading"}
            />

            <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wider font-medium">
              What interests you?
            </p>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {SUBSCRIBE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  disabled={state === "loading"}
                  className={`
                    flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                    border focus:outline-none focus:ring-2 focus:ring-white/20
                    ${
                      selectedCategories.includes(cat.id)
                        ? "bg-white/[0.08] border-white/20 text-white"
                        : "bg-transparent border-white/10 text-zinc-400 hover:border-white/15 hover:text-zinc-300"
                    }
                  `}
                >
                  <span
                    className={`
                      w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${
                        selectedCategories.includes(cat.id)
                          ? "bg-white/20 border-white/30"
                          : "border-white/20"
                      }
                    `}
                  >
                    {selectedCategories.includes(cat.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </span>
                  {cat.label}
                </button>
              ))}
            </div>

            {state === "error" && (
              <p className="text-sm text-red-400/80 mb-3">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={
                state === "loading" ||
                !email ||
                selectedCategories.length === 0
              }
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.06] hover:bg-white/[0.09] border border-white/10 hover:border-white/20 text-white rounded-lg transition-all duration-200 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {state === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </button>

            <p className="text-xs text-zinc-600 text-center mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </>
  );
}
