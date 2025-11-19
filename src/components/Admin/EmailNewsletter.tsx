import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmailNewsletter = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const { toast } = useToast();

  const personalizationTokens = [
    { token: "{F_name}", description: "User's first name" },
    { token: "{Email}", description: "User's email address" },
    { token: "{Plan}", description: "User's subscription plan" },
  ];

  const insertToken = (token: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const cursorPosition = editor.getSelection()?.index || 0;
      editor.insertText(cursorPosition, token);
      editor.setSelection(cursorPosition + token.length, 0);
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("email, full_name, plan_type");

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
          users: users.map((u) => ({
            email: u.email,
            full_name: u.full_name,
            plan_type: u.plan_type,
          })),
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
          Send a personalized newsletter to all registered users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendNewsletter} className="space-y-6">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              placeholder="Your newsletter subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Message Body */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Message Body</Label>
              <Select onValueChange={insertToken}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Insert token..." />
                </SelectTrigger>
                <SelectContent>
                  {personalizationTokens.map((item) => (
                    <SelectItem key={item.token} value={item.token}>
                      {item.token} - {item.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={message}
              onChange={setMessage}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"],
                  ["clean"],
                ],
              }}
              className="bg-background"
              placeholder="Write your newsletter content... Use the dropdown above to insert personalization tokens."
            />
          </div>

          {/* Preview Info */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Email Design:</strong> Your newsletter will include the UpAssistify logo at the top, 
              followed by your message content in a professional layout.
            </p>
          </div>

          {/* Send Button */}
          <Button type="submit" disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending to all users...
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
