import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AppLauncher = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold text-foreground mb-2">Launching UpAssistify...</p>
            <p className="text-sm text-muted-foreground">Please wait while we load your workspace</p>
          </div>
        )}
        <iframe
          src="https://upa.webworkmedia.net/"
          className="w-full h-full border-0"
          title="UpAssistify Application"
          allow="clipboard-read; clipboard-write"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

export default AppLauncher;
