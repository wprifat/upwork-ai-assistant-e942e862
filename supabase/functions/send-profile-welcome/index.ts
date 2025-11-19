import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: WelcomeEmailRequest = await req.json();
    
    console.log(`Sending welcome email to ${email} (${name})`);

    const emailResponse = await resend.emails.send({
      from: "JobMatch AI <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to JobMatch AI - Your Profile is Complete! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
                color: white;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 700;
              }
              .content {
                padding: 40px 30px;
              }
              .greeting {
                font-size: 20px;
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 20px;
              }
              .message {
                font-size: 16px;
                color: #555;
                margin-bottom: 30px;
              }
              .tips-section {
                background: #f8f9fa;
                border-left: 4px solid #667eea;
                padding: 20px;
                margin: 30px 0;
                border-radius: 4px;
              }
              .tips-section h2 {
                margin-top: 0;
                font-size: 18px;
                color: #1a1a1a;
                margin-bottom: 15px;
              }
              .tip {
                margin-bottom: 15px;
                padding-left: 25px;
                position: relative;
              }
              .tip:before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #667eea;
                font-weight: bold;
                font-size: 18px;
              }
              .tip-title {
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 4px;
              }
              .tip-description {
                color: #666;
                font-size: 14px;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
                transition: transform 0.2s;
              }
              .footer {
                background: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                color: #888;
                font-size: 14px;
              }
              .footer a {
                color: #667eea;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎯 JobMatch AI</h1>
              </div>
              
              <div class="content">
                <p class="greeting">Hey ${name}! 👋</p>
                
                <p class="message">
                  Congratulations! Your profile is now complete and you're all set to start finding 
                  your perfect job matches. Our AI is already analyzing opportunities that match 
                  your skills and experience.
                </p>
                
                <div class="tips-section">
                  <h2>💡 How to Get the Most from JobMatch AI</h2>
                  
                  <div class="tip">
                    <div class="tip-title">1. Check Your Dashboard Daily</div>
                    <div class="tip-description">
                      New job matches are updated regularly. The sooner you apply, the better your chances!
                    </div>
                  </div>
                  
                  <div class="tip">
                    <div class="tip-title">2. Review Match Scores</div>
                    <div class="tip-description">
                      Our AI calculates compatibility scores based on your skills, experience, and preferences. 
                      Focus on high-scoring matches first.
                    </div>
                  </div>
                  
                  <div class="tip">
                    <div class="tip-title">3. Keep Your Profile Updated</div>
                    <div class="tip-description">
                      Add new skills or update your hourly rate as you grow. This helps our AI find even 
                      better matches for you.
                    </div>
                  </div>
                  
                  <div class="tip">
                    <div class="tip-title">4. Use AI-Generated Proposals</div>
                    <div class="tip-description">
                      Let our AI help you craft personalized proposals that stand out. It's trained on 
                      thousands of successful applications.
                    </div>
                  </div>
                  
                  <div class="tip">
                    <div class="tip-title">5. Act on Notifications</div>
                    <div class="tip-description">
                      When you get alerts about perfect matches, respond quickly. Great opportunities 
                      don't wait!
                    </div>
                  </div>
                </div>
                
                <center>
                  <a href="${Deno.env.get('SITE_URL') || 'https://yourapp.lovable.app'}/dashboard" class="cta-button">
                    Go to Dashboard →
                  </a>
                </center>
                
                <p class="message" style="margin-top: 30px; font-size: 14px; color: #666;">
                  <strong>Pro Tip:</strong> The more active you are on the platform, the better our AI 
                  gets at understanding your preferences and finding your ideal opportunities.
                </p>
              </div>
              
              <div class="footer">
                <p>
                  Questions? We're here to help! Reply to this email anytime.
                </p>
                <p>
                  <a href="${Deno.env.get('SITE_URL') || 'https://yourapp.lovable.app'}">JobMatch AI</a> - 
                  Find Your Perfect Job Match
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-profile-welcome function:", error);
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
