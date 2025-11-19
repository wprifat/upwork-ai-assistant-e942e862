import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserData {
  email: string;
  full_name: string | null;
  plan_type: string;
}

interface NewsletterRequest {
  subject: string;
  message: string;
  users: UserData[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, message, users }: NewsletterRequest = await req.json();

    console.log(`Sending newsletter to ${users.length} recipients`);

    const emailPromises = users.map((user) => {
      // Extract first name from full_name or email
      const firstName = user.full_name 
        ? user.full_name.split(' ')[0] 
        : user.email.split('@')[0];

      // Replace personalization tokens
      let personalizedMessage = message
        .replace(/{F_name}/g, firstName)
        .replace(/{Email}/g, user.email)
        .replace(/{Plan}/g, user.plan_type.charAt(0).toUpperCase() + user.plan_type.slice(1));

      // Create professional email template
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background-color: #f5f5f5;
              }
              .email-wrapper {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
              }
              .email-header {
                background: linear-gradient(135deg, #6FBF73 0%, #5A9F5D 100%);
                padding: 40px 30px;
                text-align: center;
              }
              .logo-container {
                display: inline-flex;
                align-items: center;
                gap: 12px;
              }
              .logo {
                width: 48px;
                height: 48px;
                background-color: #ffffff;
                border-radius: 12px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
              }
              .logo-text {
                color: #6FBF73;
                font-size: 28px;
                font-weight: bold;
              }
              .brand-name {
                color: #ffffff;
                font-size: 24px;
                font-weight: 700;
                margin: 0;
              }
              .email-body {
                padding: 40px 30px;
                color: #333333;
                line-height: 1.6;
              }
              .email-body h1,
              .email-body h2,
              .email-body h3 {
                color: #1a1a1a;
                margin-top: 24px;
                margin-bottom: 12px;
              }
              .email-body p {
                margin: 16px 0;
                color: #555555;
              }
              .email-body a {
                color: #6FBF73;
                text-decoration: none;
                font-weight: 500;
              }
              .email-body ul,
              .email-body ol {
                margin: 16px 0;
                padding-left: 24px;
              }
              .email-body li {
                margin: 8px 0;
                color: #555555;
              }
              .email-footer {
                background-color: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e9ecef;
              }
              .email-footer p {
                margin: 8px 0;
                color: #6c757d;
                font-size: 14px;
              }
              .unsubscribe-link {
                color: #6c757d;
                text-decoration: underline;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <!-- Header with Logo -->
              <div class="email-header">
                <div class="logo-container">
                  <div class="logo">
                    <span class="logo-text">U</span>
                  </div>
                  <span class="brand-name">UpAssistify</span>
                </div>
              </div>
              
              <!-- Email Body -->
              <div class="email-body">
                ${personalizedMessage}
              </div>
              
              <!-- Footer -->
              <div class="email-footer">
                <p><strong>UpAssistify</strong></p>
                <p>AI-Powered Upwork Assistant for Freelancers</p>
                <p style="margin-top: 20px;">
                  You received this email because you are a registered user of UpAssistify.
                </p>
                <p>
                  © ${new Date().getFullYear()} UpAssistify. All rights reserved.
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      return resend.emails.send({
        from: "UpAssistify <onboarding@resend.dev>",
        to: [user.email],
        subject: subject,
        html: emailHtml,
      });
    });

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
