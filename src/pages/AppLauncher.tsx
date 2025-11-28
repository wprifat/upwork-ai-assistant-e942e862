import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AppLauncher = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (!loading) return;

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    // Timeout to detect if iframe doesn't load
    const timeout = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 15000); // 15 second timeout

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loading, iframeKey]);

  const handleIframeLoad = () => {
    setProgress(100);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleIframeError = () => {
    setError(true);
    setLoading(false);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setProgress(0);
    setIframeKey(prev => prev + 1);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header with back button */}
      <div className="bg-background border-b px-4 py-3 flex items-center gap-4 shrink-0">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-lg font-semibold">UpAssistify</h1>
      </div>

      {/* Content area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Loading overlay */}
        {loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-20 animate-fade-in">
            <div className="max-w-md w-full px-6 space-y-6">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
              <div className="text-center space-y-2">
                <p className="text-xl font-semibold text-foreground">Launching UpAssistify...</p>
                <p className="text-sm text-muted-foreground">Loading your workspace securely</p>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">{progress}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-20 p-6">
            <div className="max-w-md w-full space-y-6">
              <Alert variant="destructive">
                <AlertDescription>
                  The app cannot be loaded in an embedded view due to security restrictions.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col gap-3">
                <Button onClick={handleRetry} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => navigate('/dashboard')} variant="ghost">
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Iframe */}
        <iframe
          key={iframeKey}
          src="https://proposal-assistant.upassistify.com/"
          className="w-full h-full border-0"
          title="UpAssistify Application"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          allow="clipboard-read; clipboard-write"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>
    </div>
  );
};

export default AppLauncher;
