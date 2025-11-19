import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  subject: string;
  message: string;
  recipients: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, message, recipients }: NewsletterRequest = await req.json();

    console.log(`Sending newsletter to ${recipients.length} recipients`);

    const emailPromises = recipients.map((email) =>
      resend.emails.send({
        from: "UpAssistify <onboarding@resend.dev>",
        to: [email],
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
              UpAssistify Newsletter
            </h1>
            <div style="margin: 20px 0; line-height: 1.6; color: #666;">
              ${message.split('\n').map(line => `<p>${line}</p>`).join('')}
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="color: #999; font-size: 12px; text-align: center;">
              You received this email because you are a registered user of UpAssistify.<br/>
              © ${new Date().getFullYear()} UpAssistify. All rights reserved.
            </p>
          </div>
        `,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    
    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failureCount = results.filter((r) => r.status === "rejected").length;

    console.log(`Newsletter sent: ${successCount} succeeded, ${failureCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        failed: failureCount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
