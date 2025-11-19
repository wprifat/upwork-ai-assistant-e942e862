import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SignupEmailRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: SignupEmailRequest = await req.json();
    const displayName = name || email.split('@')[0];
    
    console.log(`Sending signup welcome email to ${email}`);

    const emailResponse = await resend.emails.send({
      from: "JobMatch AI <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to JobMatch AI! 🚀",
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
                font-size: 32px;
                font-weight: 700;
              }
              .content {
                padding: 40px 30px;
              }
              .greeting {
                font-size: 24px;
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 20px;
              }
              .message {
                font-size: 16px;
                color: #555;
                margin-bottom: 30px;
                line-height: 1.8;
              }
              .steps-section {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 30px;
                margin: 30px 0;
              }
              .steps-section h2 {
                margin-top: 0;
                font-size: 20px;
                color: #1a1a1a;
                margin-bottom: 25px;
                text-align: center;
              }
              .step {
                display: flex;
                margin-bottom: 25px;
                align-items: start;
              }
              .step-number {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 18px;
                flex-shrink: 0;
                margin-right: 15px;
              }
              .step-content {
                flex: 1;
              }
              .step-title {
                font-weight: 600;
                color: #1a1a1a;
                margin-bottom: 5px;
                font-size: 16px;
              }
              .step-description {
                color: #666;
                font-size: 14px;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px 40px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                margin: 20px 0;
                transition: transform 0.2s;
              }
              .highlight-box {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px 20px;
                margin: 25px 0;
                border-radius: 4px;
              }
              .highlight-box strong {
                color: #856404;
              }
              .footer {
                background: #f8f9fa;
                padding: 25px 30px;
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
                <h1>🎯 Welcome to JobMatch AI!</h1>
              </div>
              
              <div class="content">
                <p class="greeting">Hi ${displayName}! 👋</p>
                
                <p class="message">
                  Thank you for joining JobMatch AI! We're excited to help you discover 
                  your perfect job matches using the power of AI. You're now part of a 
                  community of professionals finding opportunities that truly match their skills.
                </p>
                
                <div class="steps-section">
                  <h2>🚀 Get Started in 3 Easy Steps</h2>
                  
                  <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                      <div class="step-title">Complete Your Profile</div>
                      <div class="step-description">
                        Add your skills, experience, and preferences. The more complete your 
                        profile, the better our AI can match you with opportunities.
                      </div>
                    </div>
                  </div>
                  
                  <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                      <div class="step-title">Browse AI-Matched Jobs</div>
                      <div class="step-description">
                        Our AI analyzes thousands of job postings and shows you the ones that 
                        best match your profile with compatibility scores.
                      </div>
                    </div>
                  </div>
                  
                  <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                      <div class="step-title">Apply with AI Assistance</div>
                      <div class="step-description">
                        Use our AI-powered proposal generator to create compelling applications 
                        that stand out from the crowd.
                      </div>
                    </div>
                  </div>
                </div>
                
                <center>
                  <a href="${Deno.env.get('SITE_URL') || 'https://yourapp.lovable.app'}/profile-create" class="cta-button">
                    Complete Your Profile →
                  </a>
                </center>
                
                <div class="highlight-box">
                  <strong>💡 Pro Tip:</strong> Enable notifications to get instant alerts when 
                  new high-scoring job matches become available. Early applications get better results!
                </div>
                
                <p class="message" style="margin-top: 30px;">
                  We're here to support you every step of the way. If you have any questions 
                  or need help getting started, just reply to this email.
                </p>
              </div>
              
              <div class="footer">
                <p style="margin-bottom: 10px;">
                  <strong>Need help?</strong> Reply to this email or visit our help center
                </p>
                <p>
                  <a href="${Deno.env.get('SITE_URL') || 'https://yourapp.lovable.app'}">JobMatch AI</a> - 
                  Your AI-Powered Job Matching Platform
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Signup welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-signup-welcome function:", error);
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
