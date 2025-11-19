import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AppLauncher = () => {
  const navigate = useNavigate();

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
        <iframe
          src="https://upa.webworkmedia.net/"
          className="w-full h-full border-0"
          title="UpAssistify Application"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
};

export default AppLauncher;
