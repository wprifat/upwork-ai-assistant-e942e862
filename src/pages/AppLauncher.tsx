import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const AppLauncher = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) return;

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90; // Stop at 90% until iframe actually loads
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [loading]);

  const handleIframeLoad = () => {
    setProgress(100);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header with back button */}
      <div className="bg-background border-b px-4 py-3 flex items-center gap-4">
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

      {/* Iframe container */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 animate-fade-in">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
            <p className="text-lg font-semibold text-foreground mb-2">Launching UpAssistify...</p>
            <p className="text-sm text-muted-foreground mb-6">Please wait while we load your workspace</p>
            
            {/* Progress Bar */}
            <div className="w-64 space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">{progress}%</p>
            </div>
          </div>
        )}
        <iframe
          src="https://upa.webworkmedia.net/"
          className="w-full h-full border-0"
          title="UpAssistify Application"
          allow="clipboard-read; clipboard-write"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};

export default AppLauncher;
