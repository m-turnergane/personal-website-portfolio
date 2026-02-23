"use client";

export function SubscribeTrigger() {
  return (
    <button
      onClick={() =>
        window.dispatchEvent(new CustomEvent("open-subscribe-modal"))
      }
      className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors duration-200 underline underline-offset-2"
    >
      Subscribe to updates
    </button>
  );
}
