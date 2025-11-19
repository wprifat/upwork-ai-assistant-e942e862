import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";

const EmailNewsletter = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("email");

      if (usersError) throw usersError;

      if (!users || users.length === 0) {
        toast({
          title: "No users found",
          description: "There are no users to send the newsletter to.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.functions.invoke("send-newsletter", {
        body: {
          subject,
          message,
          recipients: users.map((u) => u.email),
        },
      });

      if (error) throw error;

      toast({
        title: "Newsletter sent!",
        description: `Successfully sent to ${users.length} users.`,
      });

      setSubject("");
      setMessage("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send newsletter",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Email Newsletter</CardTitle>
        <CardDescription>
          Send a newsletter to all registered users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendNewsletter} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Newsletter subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Your newsletter message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={loading}
              rows={10}
              className="resize-none"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Newsletter
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailNewsletter;
