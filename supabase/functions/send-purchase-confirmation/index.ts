import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PurchaseEmailRequest {
  email: string;
  name?: string;
  plan: string;
  amount: number;
  transactionId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, plan, amount, transactionId }: PurchaseEmailRequest = await req.json();
    const displayName = name || email.split('@')[0];
    
    console.log(`Sending purchase confirmation email to ${email} for ${plan} plan`);

    const planDetails = {
      lifetime: {
        title: "Lifetime Access",
        features: ["Unlimited job matches", "AI proposal generator", "Priority support", "Early access to new features"],
        period: "Forever"
      },
      monthly: {
        title: "Monthly Subscription",
        features: ["Unlimited job matches", "AI proposal generator", "Email support", "Cancel anytime"],
        period: "Monthly"
      }
    };

    const currentPlan = planDetails[plan as keyof typeof planDetails] || planDetails.lifetime;

    const emailResponse = await resend.emails.send({
      from: "JobMatch AI <onboarding@resend.dev>",
      to: [email],
      subject: `Payment Confirmed - ${currentPlan.title} 🎉`,
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
                padding: 50px 30px;
                text-align: center;
                color: white;
              }
              .success-icon {
                font-size: 64px;
                margin-bottom: 15px;
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
              .receipt-box {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 25px;
                margin: 30px 0;
              }
              .receipt-row {
                display: flex;
                justify-content: space-between;
                padding: 12px 0;
                border-bottom: 1px solid #e9ecef;
              }
              .receipt-row:last-child {
                border-bottom: none;
                padding-top: 20px;
                font-weight: 600;
                font-size: 18px;
                color: #1a1a1a;
              }
              .receipt-label {
                color: #666;
              }
              .receipt-value {
                color: #1a1a1a;
                font-weight: 500;
              }
              .features-section {
                background: #fff;
                border: 2px solid #667eea;
                border-radius: 8px;
                padding: 25px;
                margin: 30px 0;
              }
              .features-section h3 {
                margin-top: 0;
                color: #1a1a1a;
                font-size: 18px;
                margin-bottom: 20px;
              }
              .feature-item {
                display: flex;
                align-items: start;
                margin-bottom: 12px;
                color: #555;
              }
              .feature-item:before {
                content: "✓";
                color: #667eea;
                font-weight: bold;
                font-size: 18px;
                margin-right: 12px;
                flex-shrink: 0;
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
                <div class="success-icon">✓</div>
                <h1>Payment Successful!</h1>
              </div>
              
              <div class="content">
                <p class="greeting">Thank you, ${displayName}! 🎉</p>
                
                <p class="message">
                  Your payment has been successfully processed. You now have full access to 
                  ${currentPlan.title} and all its premium features!
                </p>
                
                <div class="receipt-box">
                  <div class="receipt-row">
                    <span class="receipt-label">Plan</span>
                    <span class="receipt-value">${currentPlan.title}</span>
                  </div>
                  <div class="receipt-row">
                    <span class="receipt-label">Billing Period</span>
                    <span class="receipt-value">${currentPlan.period}</span>
                  </div>
                  ${transactionId ? `
                  <div class="receipt-row">
                    <span class="receipt-label">Transaction ID</span>
                    <span class="receipt-value">${transactionId}</span>
                  </div>
                  ` : ''}
                  <div class="receipt-row">
                    <span class="receipt-label">Amount Paid</span>
                    <span class="receipt-value">$${amount.toFixed(2)}</span>
                  </div>
                </div>
                
                <div class="features-section">
                  <h3>🚀 What's Included in Your Plan</h3>
                  ${currentPlan.features.map(feature => `
                    <div class="feature-item">${feature}</div>
                  `).join('')}
                </div>
                
                <center>
                  <a href="${Deno.env.get('SITE_URL') || 'https://yourapp.lovable.app'}/dashboard" class="cta-button">
                    Go to Dashboard →
                  </a>
                </center>
                
                <p class="message" style="margin-top: 30px; font-size: 14px;">
                  <strong>Need help?</strong> Our support team is here for you. Just reply to 
                  this email with any questions about your subscription or using the platform.
                </p>
              </div>
              
              <div class="footer">
                <p style="margin-bottom: 10px;">
                  This is your payment confirmation. Keep this email for your records.
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

    console.log("Purchase confirmation email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-purchase-confirmation function:", error);
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
