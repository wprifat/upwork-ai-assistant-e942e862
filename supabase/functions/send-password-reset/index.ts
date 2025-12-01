import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetLink }: PasswordResetRequest = await req.json();

    console.log("Sending password reset email to:", email);

    const emailResponse = await resend.emails.send({
      from: "UpAssistify <onboarding@resend.dev>",
      to: [email],
      subject: "Reset Your Password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 40px 0;">
              <tr>
                <td align="center">
                  <!-- Main Container -->
                  <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header with Brand Color -->
                    <tr>
                      <td style="background-color: #6fe042; padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                          UpAssistify
                        </h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;">
                          Reset Your Password
                        </h2>
                        
                        <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                          We received a request to reset your password for your UpAssistify account. Click the button below to create a new password:
                        </p>

                        <!-- CTA Button -->
                        <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
                          <tr>
                            <td style="border-radius: 6px; background-color: #6fe042;">
                              <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p style="margin: 20px 0 10px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                          Or copy and paste this link into your browser:
                        </p>
                        
                        <p style="margin: 0; padding: 12px; background-color: #f9f9f9; border-radius: 4px; color: #333333; font-size: 14px; word-break: break-all;">
                          ${resetLink}
                        </p>

                        <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #eeeeee;">
                          <p style="margin: 0 0 10px 0; color: #999999; font-size: 14px; line-height: 1.6;">
                            If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                          </p>
                          <p style="margin: 0; color: #999999; font-size: 14px; line-height: 1.6;">
                            This link will expire in 1 hour for security reasons.
                          </p>
                        </div>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                        <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px;">
                          © ${new Date().getFullYear()} UpAssistify. All rights reserved.
                        </p>
                        <p style="margin: 0; color: #999999; font-size: 12px;">
                          AI-powered proposals for Upwork success
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
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
