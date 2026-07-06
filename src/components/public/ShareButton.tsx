"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export default function ShareButton({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled the share sheet — nothing to do
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
      style={{ background: "var(--foreground)" }}
      aria-label="Share this page"
    >
      {copied ? <Check size={22} /> : <Share2 size={22} />}
    </button>
  );
}
