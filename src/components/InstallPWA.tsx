import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show banner on iOS after a delay
    if (ios && !standalone) {
      const timer = setTimeout(() => setShowInstallBanner(true), 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem("pwa-banner-dismissed", "true");
  };

  // Don't show if already installed or banner was dismissed
  if (isStandalone || !showInstallBanner || localStorage.getItem("pwa-banner-dismissed")) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-background border border-border rounded-xl shadow-hover p-4 z-50 animate-fade-up">
      <button
        onClick={dismissBanner}
        className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full transition-colors"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-gold rounded-lg flex items-center justify-center flex-shrink-0">
          <Download className="h-6 w-6 text-accent-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-foreground text-sm">Install Beyond House</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {isIOS
              ? "Tap the share button and select 'Add to Home Screen'"
              : "Install our app for a better experience"}
          </p>
          {!isIOS && deferredPrompt && (
            <Button onClick={handleInstall} variant="gold" size="sm" className="mt-3 w-full">
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;