import { AlertCircle, RefreshCw, X } from "lucide-react";
import { useState } from "react";

interface ErrorNotificationProps {
  error: Error | null;
  onDismiss?: () => void;
}

export function ErrorNotification({
  error,
  onDismiss,
}: ErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!error || !isVisible) return null;

  const isCircuitBreakerError =
    error.message?.includes("circuit breaker") ||
    error.message?.includes("rate limit") ||
    error.message?.includes("too many requests");

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleResetMetaMask = () => {
    window.open(
      "https://support.metamask.io/hc/en-us/articles/360015289632-How-to-clear-your-activity-tab-data-to-reset-your-account",
      "_blank"
    );
  };

  return (
    <div className="fixed top-4 right-4 max-w-md z-50 animate-slide-in">
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-red-400 mb-1">
              {isCircuitBreakerError
                ? "MetaMask Connection Issue"
                : "Transaction Error"}
            </h3>

            <p className="text-xs text-gray-300 mb-3">
              {isCircuitBreakerError ? (
                <>
                  MetaMask's circuit breaker is active. This happens when there
                  are too many RPC requests.
                </>
              ) : (
                error.message || "An unexpected error occurred"
              )}
            </p>

            {isCircuitBreakerError && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-200">
                  Quick Fixes:
                </p>
                <div className="space-y-1.5 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset MetaMask account (Settings → Advanced)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3" />
                    <span>Switch to another network and back</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3" />
                    <span>Wait 5-10 minutes and try again</span>
                  </div>
                </div>

                <button
                  onClick={handleResetMetaMask}
                  className="mt-3 w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-md text-xs font-medium transition-colors"
                >
                  Learn How to Reset MetaMask
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="shrink-0 text-gray-400 hover:text-gray-300 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Usage example:
/*
import { ErrorNotification } from "./components/ErrorNotification";

function App() {
  const [error, setError] = useState<Error | null>(null);

  return (
    <>
      <ErrorNotification error={error} onDismiss={() => setError(null)} />
      <YourAppContent />
    </>
  );
}
*/
