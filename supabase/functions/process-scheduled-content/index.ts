import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Processing scheduled content...");

    // Process scheduled newsletters
    const { data: scheduledNewsletters, error: newslettersError } = await supabase
      .from("scheduled_newsletters")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_for", new Date().toISOString());

    if (newslettersError) {
      console.error("Error fetching scheduled newsletters:", newslettersError);
    } else if (scheduledNewsletters && scheduledNewsletters.length > 0) {
      console.log(`Found ${scheduledNewsletters.length} newsletters to send`);

      for (const newsletter of scheduledNewsletters) {
        try {
          // Get all users
          const { data: users, error: usersError } = await supabase
            .from("profiles")
            .select("email, full_name, plan_type");

          if (usersError) throw usersError;

          if (users && users.length > 0) {
            // Send newsletter
            const { error: sendError } = await supabase.functions.invoke("send-newsletter", {
              body: {
                subject: newsletter.subject,
                message: newsletter.message,
                users: users.map((u) => ({
                  email: u.email,
                  full_name: u.full_name,
                  plan_type: u.plan_type,
                })),
              },
            });

            if (sendError) throw sendError;

            // Mark as sent
            await supabase
              .from("scheduled_newsletters")
              .update({
                status: "sent",
                sent_at: new Date().toISOString(),
              })
              .eq("id", newsletter.id);

            console.log(`Newsletter ${newsletter.id} sent successfully`);
          }
        } catch (error: any) {
          console.error(`Error sending newsletter ${newsletter.id}:`, error);
          
          // Mark as failed
          await supabase
            .from("scheduled_newsletters")
            .update({
              status: "failed",
              error_message: error.message,
            })
            .eq("id", newsletter.id);
        }
      }
    }

    // Process scheduled blog posts
    const { data: scheduledPosts, error: postsError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", false)
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString());

    if (postsError) {
      console.error("Error fetching scheduled blog posts:", postsError);
    } else if (scheduledPosts && scheduledPosts.length > 0) {
      console.log(`Found ${scheduledPosts.length} blog posts to publish`);

      for (const post of scheduledPosts) {
        try {
          await supabase
            .from("blog_posts")
            .update({ published: true })
            .eq("id", post.id);

          console.log(`Blog post ${post.id} published successfully`);
        } catch (error: any) {
          console.error(`Error publishing blog post ${post.id}:`, error);
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        newslettersSent: scheduledNewsletters?.length || 0,
        postsPublished: scheduledPosts?.length || 0,
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in process-scheduled-content:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
