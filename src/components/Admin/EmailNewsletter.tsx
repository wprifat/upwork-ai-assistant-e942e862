import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Calendar, Clock } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

const EmailNewsletter = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState("12:00");
  const quillRef = useRef<ReactQuill>(null);
  const { toast } = useToast();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

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
      if (scheduleEnabled) {
        // Schedule newsletter
        if (!scheduledDate) {
          toast({
            title: "Date required",
            description: "Please select a date for the scheduled newsletter.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const [hours, minutes] = scheduledTime.split(':');
        const scheduledDateTime = new Date(scheduledDate);
        scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { error: scheduleError } = await supabase
          .from("scheduled_newsletters")
          .insert({
            subject,
            message,
            scheduled_for: scheduledDateTime.toISOString(),
            created_by: user.id,
          });

        if (scheduleError) throw scheduleError;

        toast({
          title: "Newsletter scheduled!",
          description: `Will be sent on ${format(scheduledDateTime, "PPP 'at' p")}`,
        });
      } else {
        // Send immediately
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

        if (error) {
          console.error("send-newsletter invoke error", error);
          throw error;
        }


        toast({
          title: "Newsletter sent!",
          description: `Successfully sent to ${users.length} users.`,
        });
      }

      setSubject("");
      setMessage("");
      setScheduleEnabled(false);
      setScheduledDate(undefined);
      setScheduledTime("12:00");
    } catch (error: any) {
      console.error("handleSendNewsletter error", error);
      const description =
        error?.message ||
        error?.error?.message ||
        typeof error === "string"
          ? error
          : "Failed to process newsletter";

      toast({
        title: "Error",
        description,
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
          <span className="mt-1 block text-xs text-muted-foreground">
            Backend: {supabaseUrl || "not set"} (project: {supabaseProjectId || "not set"})
          </span>
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

          {/* Scheduling Options */}
          <div className="space-y-4 p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="schedule-toggle">Schedule Newsletter</Label>
                <p className="text-sm text-muted-foreground">
                  Send newsletter at a specific date and time
                </p>
              </div>
              <Switch
                id="schedule-toggle"
                checked={scheduleEnabled}
                onCheckedChange={setScheduleEnabled}
              />
            </div>

            {scheduleEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !scheduledDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Info */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Email Design:</strong> Your newsletter will be displayed in a professional layout 
              with a green header followed by your message content.
            </p>
          </div>

          {/* Send Button */}
          <Button type="submit" disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {scheduleEnabled ? "Scheduling..." : "Sending to all users..."}
              </>
            ) : scheduleEnabled ? (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Newsletter
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
