"use client";

import { useEffect, useState } from "react";
import { Download, X, Share, Plus } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstaller() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Robust iOS detection - iPhone, iPad (including iPadOS which reports as Mac)
    const ua = window.navigator.userAgent;
    const isIphone = /iphone|ipad|ipod/i.test(ua);
    const isIpadOS = /macintosh/i.test(ua) && "ontouchend" in document;
    const ios = isIphone || isIpadOS;
    setIsIOS(ios);

    // Detect if running as installed app
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("SW registration failed:", err));
    }

    // Android Chrome: beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      const dismissedAt = localStorage.getItem("pwa-install-dismissed-at");
      const shouldShow = !dismissedAt || Date.now() - Number(dismissedAt) > 3 * 24 * 60 * 60 * 1000;
      if (shouldShow) setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS: show manual instructions (since beforeinstallprompt doesn't fire)
    if (ios && !standalone) {
      const dismissedAt = localStorage.getItem("pwa-install-dismissed-at");
      const shouldShow = !dismissedAt || Date.now() - Number(dismissedAt) > 3 * 24 * 60 * 60 * 1000;
      if (shouldShow) {
        // Show immediately, no delay
        setShowBanner(true);
      }
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setPromptEvent(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed-at", String(Date.now()));
  };

  // Don't show if already installed
  if (isStandalone) return null;
  if (!showBanner) return null;
  // Need either a prompt event (Android) or iOS detected
  if (!promptEvent && !isIOS) return null;

  return (
    <div className="fixed bottom-4 start-4 end-4 sm:start-auto sm:end-4 sm:w-80 z-[100] rounded-2xl border border-border bg-card shadow-2xl p-4 animate-fade-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 end-2 text-muted-foreground hover:text-foreground"
        aria-label="סגור"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Download className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0 pe-4">
          <p className="text-sm font-bold text-foreground mb-1">התקן את Drivly</p>

          {isIOS ? (
            <>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                כדי להתקין: לחץ על{" "}
                <Share className="inline h-4 w-4 text-primary mx-0.5 align-text-bottom" />
                {" "}בסרגל הכלים של Safari ובחר{" "}
                <span className="inline-flex items-center gap-0.5 font-semibold text-foreground">
                  <Plus className="inline h-3 w-3" />
                  הוסף למסך הבית
                </span>
              </p>
              <button
                onClick={handleDismiss}
                className="text-xs text-cyan-500 font-medium hover:underline"
              >
                הבנתי
              </button>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">
                גישה מהירה מהמסך הבית, עובד גם offline
              </p>
              <button
                onClick={handleInstall}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                התקן עכשיו
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
